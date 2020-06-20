---
permalink: /contributing.html
---

# Contributing

Hi there, fellow coder!

If you are here, it means that you are interested in contributing to this project, and we are happy about it! You will find a collections of useful ressources to get started, whatever you would like to contribute.

## The project organization

The project is organized in multiple repositories for us to be able to work on a project (eg the standard library) and update it multiple times without having to roll x different updates for the main repository, the language itself.

* [Ark](https://github.com/ArkScript-lang/Ark), the language
    * [the standard library](https://github.com/ArkScript-lang/std)
    * [the modules](https://github.com/ArkScript-lang/modules)
    * [our own implementation of a string](https://github.com/ArkScript-lang/String)
* [the website](https://github.com/ArkScript-lang/arkscript-lang.github.io)
* [the benchmarks](https://github.com/ArkScript-lang/benchmarks)
* [the VSC extension (coloration)](https://github.com/ArkScript-lang/ArkScript-VSC)
* [a documentation tool for ArkScript code](https://github.com/ArkScript-lang/ArkDoc)

## Contributing to the language, ArkScript

Clone `https://github.com/ArkScript-lang/Ark.git` and run `git submodule update --init --recursive` to clone all the submodules used by the project.

**It is advised to do this even if you want to contribute to a subproject used by ArkScript, so that you can modify the project and test it directly**

Then check that everything [builds fine](tutorials/building.html), and you're good to go.

**If you are modifying a subproject, cd in it and change it's git remote to point to your fork, then make a PR for your fork, not for the whole ArkScript repository**

## Adding an external C or C++ library to a project

Use git submodules instead of copying and pasting the code somewhere: `git submodule add https://github.com/user/name.git submodules/name` and add it to the needed CMakeLists.

## An idea, a question, a proposition or a problem?

Just create an issue in the appropriate repository, we look at them everyday.