# ArkScript website ![Latest version](https://img.shields.io/github/v/release/arkscript-lang/ark?include_prereleases&style=for-the-badge)

This repository is hosting the presentation and documentation of the language.

## A brief tour

The website is generated in root folder through Pug, allowing us to easily split the code for each page and reuse components.

Install Node.js then Pug with `npm i`. The run `node main.js` to generate the HTML files. You can start a webserver with `python3 -m http.server`.

### Language presentation

This is located in `views/index.pug` + every root Pug files.

The tutorials (understanding the language, and how to build the language) are under the folder `views/tutorials/`.

### ArkScript source code documentation

This one is automatically generated through Doxygen by our development team, under `impl/`. Do not modify this folder as every change will get erased by Doxygen each time we regenerate the documentation.

The Doxyfile for this is in the [core repository](https://github.com/ArkScript-lang/Ark).

### ArkScript std lib documentation

This is automatically regenerated every day at 00:00 by a GitHub action on this repository, using our [documentation generator (ArkDoc)](https://github.com/ArkScript-lang/ArkDoc), and the latest version of the [standard library](https://github.com/ArkScript-lang/std) (master branch only).

## Contributing

* First, [fork](https://github.com/ArkScript-lang/arkscript-lang.github.io/fork) the repository
* Then, clone your fork: `git clone git@github.com:username/website.git`
* Create a branch for your feature: `git checkout -b feat-my-awesome-idea`
* When you're done, push it to your fork and submit a pull request!

### Development

You can use `nodemon -w views -e pug main.js` alongside a `python3 -m http.server` so that files are updated immediately when modified, without having to launch `main.js` and boot yet another webserver.
