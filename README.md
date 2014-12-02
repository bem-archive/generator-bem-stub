# generator-bem-stub [![Build Status](https://travis-ci.org/bem/generator-bem-stub.svg)](https://travis-ci.org/bem/generator-bem-stub) [![Coverage Status](https://img.shields.io/coveralls/bem/generator-bem-stub.svg)](https://coveralls.io/r/bem/generator-bem-stub?branch=master) [![Dependency Status](https://david-dm.org/bem/generator-bem-stub.svg)](https://david-dm.org/bem/generator-bem-stub) [![devDependency Status](https://david-dm.org/bem/generator-bem-stub/dev-status.svg)](https://david-dm.org/bem/generator-bem-stub#info=devDependencies)

`generator-bem-stub` is a generator of [BEM](http://bem.info/) projects for [Yeoman](http://yeoman.io).

## Introduction

There are several assemblers for [BEM](http://bem.info/) projects — [bem-tools](http://bem.info/tools/bem/bem-tools/) and [ENB](https://github.com/enb-make/enb). What does any developer do by starting a new [BEM](http://bem.info/) project? First and foremost, a developer creates a configuration file for an assembler which he is going to use. Unfortunately it is rather time-consuming and prone to error process both for [bem-tools](http://bem.info/tools/bem/bem-tools/) and [ENB](https://github.com/enb-make/enb).

In order to save time and decrease barrier to entry into the tools for assembly, we decided to create a generator of configuration files which allows a developer to configure the assembly without immersion into tools' **API**. This generator provides you the ability to get the base of [BEM](http://bem.info/) project in few minutes by answering the simple questions.

## Install

To install the generator run:

```bash
$ npm install -g generator-bem-stub
```

## Usage

Run:

```bash
$ yo bem-stub
```

To create the config file fitting for your project, the generator will ask several questions. Note that some of them depend on the previous ones, for example:

* If you have chosen library [bem-components](http://bem.info/libs/bem-components/current/), `generator-bem-stub` will choose [Autoprefixer](https://github.com/postcss/autoprefixer) and CSS preprocessor [Stylus](https://github.com/LearnBoost/stylus) as default.

* You can choose template engine [BH](https://github.com/enb-make/bh) only if you have chosen assembler [ENB](https://github.com/enb-make/enb).

* If you have not chosen technology [BEMJSON](http://bem.info/technology/bemjson/current/bemjson/), bundles will be assembled from [BEMDECL](http://bem.info/technology/bemjson/current/bemjson/).

* You can build HTML only if you have chosen technology [BEMJSON](http://bem.info/technology/bemjson/current/bemjson/) and template engine [BEMHTML](http://bem.info/technology/bemhtml/current/intro/) or [BH](https://github.com/enb-make/bh).

* You will be able to choose which separate files to minimize only if you have chosen assembler [ENB](https://github.com/enb-make/enb) ([bem-tools](http://bem.info/tools/bem/bem-tools/) does not support configuration of minimization, all possible files are minimized by [borschik](http://bem.info/tools/optimizers/borschik/)).

### What does generator-bem-stub support?

* Assemblers:
 * [bem-tools](http://bem.info/tools/bem/bem-tools/)
 * [ENB](https://github.com/enb-make/enb)
* Libraries:
 * [bem-core](http://bem.info/libs/bem-core/current/)
 * [bem-components](http://bem.info/libs/bem-components/current/)
* Platforms:
 * desktop
 * touch-pad
 * touch-phone
* CSS preprocessors:
 * [Stylus](https://github.com/LearnBoost/stylus)
 * [Less](https://github.com/less/less.js)
* [Autoprefixer](https://github.com/postcss/autoprefixer)
* Technologies:
 * [BEMJSON](http://bem.info/technology/bemjson/current/bemjson/)
 * [BEMDECL](http://bem.info/technology/bemjson/current/bemjson/)
 * [BEMTREE](http://en.bem.info/technology/bemtree/current/bemtree/)
 * node.js
 * browser.js
* Template engines:
 * [BEMHTML](http://bem.info/technology/bemhtml/current/intro/)
 * [BH](https://github.com/enb-make/bh) (only in [ENB](https://github.com/enb-make/enb))
* Building of HTML
* Minimization of separate files (only in [ENB](https://github.com/enb-make/enb))

### Installation of dependencies

`generator-bem-stub` will install all dependencies and libraries after generation of the project.

If you do not want to install dependencies and libraries, use the option `--skip-install`:

```bash
$ yo bem-stub --skip-install
```

### Versions

You can check in the file [app/config/versions.js](https://github.com/bem/generator-bem-stub/blob/master/app/config/versions.js) which versions of the dependencies and libraries `generator-bem-stub` uses.

