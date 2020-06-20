---
permalink: /tutorials/building.html
---

# Building and installing

You can choose to build the project from source (which requires some knowledge like git, cmake and using shell commands) or get a build from a ZIP file.

## Setup

You can setup an environment variable named `ARKSCRIPT_PATH`, with the path to the installation directory of ArkScript, so that the standard library can be located without using `--lib <path>`. *This step is optional*.

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
- cmake >= 3.8

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
- cmake >= 3.8

Commands:
```bash
# if you don't need the modules, you can forget the ARK_BUILD_MODULES define
~/ark$ cmake . -Bbuild -DARK_BUILD_EXE=On -DARK_BUILD_MODULES=On
~/ark$ cmake --build build --config Release
~/ark$ sudo cmake --install build --config Release  # needs administrator rights to install under /usr/bin
```

### MacOS

Requirements:
- g++ 9
- cmake >= 3.8

On MacOS versions prior to 10.15, `libc++` lacks `filesystem` in the standard library.

You will need to :
* install a newer compiler using [Homebrew](https://docs.brew.sh/): `brew install gcc && brew link gcc`
* pass compiler path to `cmake` in the build step: `-DCMAKE_CXX_COMPILER=/usr/local/bin/g++-9`

Commands:
```bash
~/ark$ cmake . -Bbuild -DARK_BUILD_EXE=On -DARK_BUILD_MODULES=On -DCMAKE_CXX_COMPILER=/usr/local/bin/g++-9
~/ark$ cmake --build build --config Release
~/ark$ cmake --install build --config Release  # might need administrator rights
```

## From a release

### Windows

Download the `win64.zip` from the [releases](https://github.com/ArkScript-lang/Ark/releases/latest), and unpack it wherever you want, as long as you remember where (or add the location to an environment variable as specified in the setup section, to avoid using `--lib <path>`).

To use the command `Ark` from everywhere, you will need to [add it to your PATH](https://docs.microsoft.com/en-us/previous-versions/office/developer/sharepoint-2010/ee537574(v=office.14)) environment variable.

### Linux

Download the `linux64.zip` from the [releases](https://github.com/ArkScript-lang/Ark/releases/latest). You can put the binaries and the lib anywhere you want, as long as you add it to your path to execute ArkScript without giving the complete path (in your BASHRC for example). You can also create an environment variable as stated in the setup above.