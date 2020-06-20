---
permalink: /tutorials/basics.html
---

# Learning ArkScript: the basics

In ArkScript, there are two main rules: `(a b c ...)` is a function call, `a` begin the function, `b c ...` being the arguments. The second rule is the **only** exception to the first rule: when declaring functions like `(fun (arg1 arg2 ...) body)`, the definition of the argument block **isn't** considered as a function call.

## Creating variables

In ArkScript, there are 2 types of *variables*: *mutables* and *immutables*. The *immutable* variables can't be modified or redefined, while *mutable* variables can.

Example:

```clojure
(let a 12)  # immutable variable
(let a "hello")  # can not redefined constant
(set a "world")  # can not modify constant, will throw an error

(mut b [12 42 64])  # mutable variable
(mut b "hello")  # no problem, the operation is allowed
(set b "ArkScript is cool!")  # no problem, operation is allowed on mutables
```

## Comments

As you have seen in the example above, we can write code that won't be executed, using `# text`. This is a comment, only for the developer, to know what is going on for example.