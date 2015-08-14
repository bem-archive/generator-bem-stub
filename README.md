# generator-bem-stub [![Build Status](https://travis-ci.org/bem/generator-bem-stub.svg)](https://travis-ci.org/bem/generator-bem-stub) [![Coverage Status](https://img.shields.io/coveralls/bem/generator-bem-stub.svg)](https://coveralls.io/r/bem/generator-bem-stub?branch=master) [![Dependency Status](https://david-dm.org/bem/generator-bem-stub.svg)](https://david-dm.org/bem/generator-bem-stub) [![devDependency Status](https://david-dm.org/bem/generator-bem-stub/dev-status.svg)](https://david-dm.org/bem/generator-bem-stub#info=devDependencies)

`generator-bem-stub` is a generator of [BEM](http://en.bem.info/) projects for [Yeoman](http://yeoman.io).

<!-- TOC -->
- [Introduction](#introduction)
- [Install](#install)
- [Update](#update)
- [Usage](#usage)
  - [Options](#options)
  - [Example](#example)
- [What does generator-bem-stub support?](#what-does-generator-bem-stub-support)
- [Versions](#versions)

<!-- TOC END -->

## Introduction

There are several assemblers for [BEM](https://en.bem.info/) projects — [bem-tools](https://en.bem.info/tools/bem/bem-tools/) (the developing of this assembler is frozen) and [ENB](https://github.com/enb-make/enb). What does any developer do by starting a new [BEM](https://en.bem.info/) project? First and foremost, a developer creates a configuration file for an assembler which he is going to use. Unfortunately it is rather time-consuming and prone to error process both for [bem-tools](https://en.bem.info/tools/bem/bem-tools/) and [ENB](https://github.com/enb-make/enb).

In order to save time and decrease barrier to entry into the tools for assembly, we decided to create a generator of configuration files which allows a developer to configure the assembly without immersion into tools' **API**. This generator provides you the ability to get the base of [BEM](https://en.bem.info/) project in few minutes by answering the simple questions.

## Install

To install the generator run:

```bash
$ npm install -g generator-bem-stub
```

If you use **`npm@>=3.0.0`**, before the installing of the generator you need to run:

```bash
$ npm install -g yo
```

**REMARK!** The global installation (with flag `-g`) is mandatory in both cases.

## Update

To update the generator run:

```bash
$ npm update -g generator-bem-stub
```

## Usage

Run:

```bash
$ yo bem-stub
```

### Options

* **skip-install** - skip the installation of dependencies and libraries after generation of the project (default: `false`).

* **tab-size** - tab size of the generated code in spaces. Specify `0` to generate tabs instead of spaces (default: `4`).

### Example

```
$ yo bem-stub --skip-install --tab-size=4
```

## What does `generator-bem-stub` support?

- Assemblers:
  - [ENB](https://github.com/enb-make/enb)
  - [bem-tools](https://en.bem.info/tools/bem/bem-tools/)
- Libraries:
  - [bem-core](https://en.bem.info/libs/bem-core/)
  - [bem-components](https://en.bem.info/libs/bem-components/)
- Redefinition levels:
  - desktop
  - touch-pad
  - touch-phone
- CSS preprocessors:
  - [Stylus](https://github.com/stylus/stylus)
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- Technologies:
  - [BEMJSON](https://en.bem.info/technology/bemjson/current/bemjson/)
  - [BEMTREE](https://en.bem.info/technology/bemtree/current/bemtree/)
  - BEMDECL
  - node.js
  - browser.js
- Template engines:
  - [BEMHTML](http://en.bem.info/technology/bemhtml/current/intro/)
  - [BH](https://en.bem.info/technology/bh/)
- Building of HTML
- Minimization of separate files

To create the config file fitting for your project, the generator will ask several questions. Note that some of them depend on the previous ones, for example:

* If you have chosen library [bem-components](https://en.bem.info/libs/bem-components/), `generator-bem-stub` will choose [Autoprefixer](https://github.com/postcss/autoprefixer) and CSS preprocessor [Stylus](https://github.com/stylus/stylus) as default.

* If you have not chosen technology [BEMJSON](https://en.bem.info/technology/bemjson/current/bemjson/), bundles will be assembled from **BEMDECL**.

* You can build HTML only if you have chosen technology [BEMJSON](https://en.bem.info/technology/bemjson/current/bemjson/) and template engine [BEMHTML](https://en.bem.info/technology/bemhtml/current/intro/) or [BH](https://en.bem.info/technology/bh/).

**REMARK!** [bem-tools](https://bem.info/tools/bem/bem-tools/) is a legacy assembler. If you choose it, the config file will be generated for [ENB](https://github.com/enb-make/enb) and your project will be built by [ENB](https://github.com/enb-make/enb),  but you will be able to use [commands](https://en.bem.info/tools/bem/bem-tools/commands/) from [bem-tools](https://en.bem.info/tools/bem/bem-tools/).

## Versions

You can check in the file [app/config/versions.js](./app/config/versions.js) which versions of the dependencies and libraries `generator-bem-stub` uses.

