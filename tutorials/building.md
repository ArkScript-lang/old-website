## Setup

You will need to setup an environment variable named `ARKSCRIPT_PATH`, with the path to the installation directory of ArkScript, so that the standard library can be located without using `--lib <path>`.

## From source

Clone the repository and go in the newly created repository, then init and update all the git submodules, as follows:
```bash
> git clone https://github.com/ArkScript-lang/Ark.git
> cd Ark
> git submodule update --init --recursive
```

If you want a specific revision or tag, you can do this right before initializing and updating the git submodules:
```bash
# for a specific revision
> git checkout <commit>
# for a specific tag
> git checkout tags/<tag>
```

### Windows

Requirements:
- Windows 10 x64
- Visual Studio 15 2017

Commands:
```bash
# if you don't need the modules, you can forget the ARK_BUILD_MODULES define
PS> cmake . -Bbuild -DARK_BUILD_EXE=On -DARK_BUILD_MODULES=On -G "Visual Studio 15 Win64"
PS> cmake --build build --config Release
PS> cmake --install build --config Release  # might need administrator rights
```

### Linux

Requirements:
- g++ 9
- 64 bits computer

Commands:
```bash
# if you don't need the modules, you can forget the ARK_BUILD_MODULES define
~/ark$ cmake . -Bbuild -DARK_BUILD_EXE=On -DARK_BUILD_MODULES=On
~/ark$ cmake --build build --config Release
~/ark$ sudo cmake --install build --config Release  # needs administrator rights to install under /usr/bin
```

## From a release

*Nota bene*: the parts about where the Ark standard library should be installed is required only if you plan to use Ark as an independant language, not as a scripting language for your projects. Also, note that it's not mandatory, since you can tell the ArkVM where your Ark standard library is installed using `-L <path>` or `--lib <path>`.

### Windows

Download the `win64.zip` from the release, and unpack it under `C:/Program Files (x86)/Ark`.

The files from the `win64.zip` archive should be put in a `bin/` folder, the lib should be in a `lib/` folder. Just add `C:/Program Files (x86)/Ark/bin` to your path and you're good to go!

### Linux

Download the `linux64.zip`. You can put the binaries and the lib anywhere you want, as long as you add it to your path to execute ArkScript without giving the complete path (in your BASHRC for example). You can also create an environment variable as stated in the setup above.