# Embedding

ArkScript was designed to be easily embedded into C++ applications, so here you go!

## Adding Ark to your project

If you are building the project with CMake:
* setting the compilation options:
    * if you don't want a Ark.exe: `set(ARK_BUILD_EXE 0)`
    * if you don't want to build the benchmarks: `set(ARK_BUILD_BENCHMARK 0)`
    * if you don't want to build the modules: `set(ARK_BUILD_MODULES 0)`
    * if you want to disable the use of `(system "command that can break your pc here")`: `set(ARK_ENABLE_SYSTEM 0)`
* add this line to your main CMakeLists.txt: `add_subdirectory(ark-directory)` (put the path to the ArkScript directory, where a CMakeLists.txt is) ; the include directories should come without having to do anything on your side
* link your project to the lib produced by Ark: `target_link_library(${PROJECT_NAME} PUBLIC ArkReactor)` (modify the privacy according to what you chosed in your project)
* you're good to go! Everything you need while be available through `#include <Ark/Ark.hpp>`

If you are **not** building the project with CMake: download CMake, create a CMakeLists.txt for your project, and go back to step 1.

## Using Ark

An example is often worth a thousand words:

```cpp
#include <Ark/Ark.hpp>

int main()
{
    // A state can be shared by multiple virtual machines (but they will never modify it)
    Ark::State state;  // leave constructor empty to select the default standard library

    // Will automatically compile the file if needed (if not, will take it from the ark cache)
    state.doFile("myfile.ark");

    // Virtual machine with debug mode turned off, use Ark::VM_debug if you need the debug mode
    // Basically, Ark::VM = Ark::VM_t</* debug */ false> and Ark::VM_debug = Arm::VM_t<true>
    Ark::VM vm(&state, /* options */ Ark::FeaturePersist);  // persistance is needed to use vm.call(function_name, args...)

    vm.run();
    
    /*
        If you just want to run a precompiled bytecode file:

        Ark::State state;
        state.feed("mybytecode.arkc");
        Ark::VM vm(&state);
        vm.run();
    */

    /*
        Both doFile and run invoke the private method safeRun, so if the virtual machine is to crash,
        it will stop, and display the errors in the shell, with a bit of context
    */

    /*
        To run an Ark function from C++ code and retrieve the result:
        we will say the code is (let foo (fun (x y) (+ x y 2)))
    */
    auto value = vm.call("foo", 5, 6.0);
    std::cout << value << "\n";  // displays 13

    return 0;
}
```

### Adding your own functions in Ark

```cpp
#include <Ark/Ark.hpp>

Ark::Value my_function(std::vector<Ark::Value>& args)
{
    // checking argument number
    if (args.size() != 4)
        throw std::runtime_error("my_function needs 4 arguments!");
    
    auto a = args[0],
        b = args[1],
        c = args[2],
        d = args[3];
    
    // checking arguments type
    if (a.valueType() != Ark::ValueType::Number ||
        b.valueType() != Ark::ValueType::Number ||
        c.valueType() != Ark::ValueType::Number ||
        d.valueType() != Ark::ValueType::Number)
        throw Ark::TypeError("Type mismatch for my_function: need only numbers");

    // type is automatically deducted from the argument
    return Ark::Value(a.number() * b.number() - c.number() / d.number());
}

int main()
{
    Ark::State state;
    state.doFile("myfile.ark");  // we can call state.doFile() before or after state.loadFunction()

    state.loadFunction("my_function", my_function);

    // we can also load C++ lambdas
    // we could have done this after creating the VM, it would still works
    // we just need to do that BEFORE we call vm.run()
    state.loadFunction("foo", [](std::vector<Ark::Value>& args) {
        return Ark::Value(static_cast<int>(args.size()));
    });

    Ark::VM vm(&state, /* options */ Ark::FeaturePersist);
    vm.run();

    return 0;
}
```

### Details on the Value type

Types available in `Ark::ValueType` are:
* `List`
* `Number`
* `String`
* `PageAddr` (reprensents the address of an Ark function in the bytecode)
* `NFT` (the triad Nil, False, True)
* `CProc` (C or C++ functions)
* `Closure` (represents a closure in Ark)
* `User` (represents a type defined by the user)

`Value` objects have this interface:
* `ValueType valueType() const` to get the type of the value held
* The following methods allow to retrieve the data held by the object, but if the type doesn't match, it's an undefined behavior:
    * `double number() const` for numbers
    * `const std::string& string() const` for strings
    * `std::string& string_ref()` for strings (use this one if you need to directly modify the object and avoid a copy)
    * `const std::vector<Value>& const_list() const` for lists
    * `std::vector<Value>& list()` for lists (use this one if you need to directly modify the object and avoid a copy)
    * `const UserType& usertype() const` for usertypes
    * `UserType& usertype_ref()` for usertypes (use this one if you need to directly modify the object and avoid a copy)
* use only if the object is a list:
    * `void push_back(const Value&)`
    * `void push_back(Value&&)`
* `std::ostream& operator<<(std::ostream& os, const Value& V)` to display the object with `std::cout << value;`
* `bool operator==(const Value& A, const Value& B)`, useful to check if the value is nil, true or false: `a == Ark::Nil` (the two others are `Ark::True` and `Ark::False`)

## Adding your own types in Ark

The idea behind this is to be able to use values which can't be held by standard Ark values, for example a `sf::Image` if you are using the SFML.

The idea is to have a unique identifier per type (that's only for you as a programmer to know which type you are receiving, Ark doesn't care about it), and a value casted as a `void*` pointer, thus the object **needs to continue to exist somewhere**.

```cpp
int main()
{
    Ark::State state;
    
    enum class Breakfast { Eggs, Bacon, Pizza };
    unsigned typeid_breakfast = 0;

    Breakfast the_best = Breakfast::Pizza;

    state.loadFunction("getBreakfast", [&typeid_breakfast, &the_best](std::vector<Ark::Value>& n) -> Ark::Value {
        // we need to send the address of the object, which will be casted
        // to void* internally
        Ark::Value v = Ark::Value(Ark::UserType(typeid_breakfast, &the_best));

        // adding a custom ostream operator
        v.usertype_ref().setOStream([](std::ostream& os, const Ark::UserType& A) -> std::ostream& {
            os << "Breakfast::";
            switch (*static_cast<Breakfast*>(A.data()))
            {
                case Breakfast::Eggs:
                    os << "Eggs";
                    break;
                
                case Breakfast::Bacon:
                    os << "Bacon";
                    break;
                
                case Breakfast::Pizza:
                    os << "Pizza";
                    break;
                
                default:
                    break;
            }
            return os;
        });

        return v;
    });

    state.loadFunction("useBreakfast", [&typeid_breakfast](std::vector<Ark::Value>& n) -> Ark::Value {
        if (n[0].valueType() == Ark::ValueType::User && n[0].usertype().type_id() == typeid_breakfast)
        {
            std::cout << "UserType detected as an enum class Breakfast" << std::endl;
            Breakfast* ptr = static_cast<Breakfast*>(n[0].usertype().data());
            std::cout << "Got " << n[0].usertype() << "\n";
            if (*ptr == Breakfast::Pizza)
                std::cout << "Good choice! Have a nice breakfast ;)" << std::endl;
        }

        return Ark::Nil;
    });

    state.doString("(begin (let a (getBreakfast)) (print a) (useBreakfast a))");
    Ark::VM vm(&state);
    vm.run();

    /*
        Will print

        Breakfast::Pizza
        UserType detected as an enum class Breakfast
        Got Breakfast::Pizza
        Good choice! Have a nice breakfast ;)
    */

    return 0;
}
```

## Creating plugins

Plugins must use the exact same configuration and compiler as the original Ark executable, otherwise they won't be loaded properly, thus it's highly encouraged to compile your module(s) using Ark CMakeLists, by putting your module(s) under the folder `arkscript/module`, and adding it in the CMakeLists of the same folder (you can start by copying the CMakeLists of a module for your own).

The compilers supported are:
* for Linux: g++-8 (Ubuntu 8.3.0-6ubuntu1~18.04.1) 8.3.0
* for Windows: MSVC version 19.16.27031.1 for x86 (*nota bene*: even if minor and patch are be different, it should work)

Basic module code:

```cpp
// this file includes everything you need for you, and does a using namespace Ark
#include <Ark/Module.hpp>

namespace MyModule
{
    Value foo(std::vector<Value>& args)
    {
        // do stuff
        // ...

        return Nil;
    }
}

// the name mustn't be misspelled, otherwise the ArkVM won't find the plugin entry table
ARK_API_EXPORT Mapping_t getFunctionsMapping()
{
    Mapping_t map;
    // map[name in Ark] = C++ function
    map["foo"] = MyModule::foo;
    map["test"] = [](std::vector<Value>& args) {
        // lambdas work too!
        return True;
    };

    return map;
}
```