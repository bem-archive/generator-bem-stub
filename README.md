# generator-bem-stub [![Build Status](https://travis-ci.org/bem/generator-bem-stub.svg)](https://travis-ci.org/bem/generator-bem-stub) [![Coverage Status](https://img.shields.io/coveralls/bem/generator-bem-stub.svg)](https://coveralls.io/r/bem/generator-bem-stub?branch=master) [![Dependency Status](https://david-dm.org/bem/generator-bem-stub.svg)](https://david-dm.org/bem/generator-bem-stub) [![devDependency Status](https://david-dm.org/bem/generator-bem-stub/dev-status.svg)](https://david-dm.org/bem/generator-bem-stub#info=devDependencies)

A generator of BEM projects for [Yeoman](http://yeoman.io).
Gives you the ability to receive the base of BEM project in few minutes by answering the simple questions.

## Install

```bash
$ npm install -g generator-bem-stub
```

## Usage

Run:

```bash
$ yo bem-stub
```

### What does generator-bem-stub support?

* Collectors:
 * [bem-tools](http://bem.info/tools/bem/bem-tools/)
 * [enb](https://github.com/enb-make/enb)
* Libraries:
 * [bem-core](http://bem.info/libs/bem-core/current/)
 * [bem-components](http://bem.info/libs/bem-components/current/) + design and autoprefixer
* Platforms:
 * desktop
 * touch-pad
 * touch-phone
* CSS pre-processors:
 * [stylus](https://github.com/LearnBoost/stylus)
 * [roole](https://github.com/curvedmark/roole)
 * [less](https://github.com/less/less.js)
* Technologies:
 * [bemjson.js](http://bem.info/technology/bemjson/current/bemjson/)
 * ie.css
 * ie6.css
 * ie7.css
 * ie8.css
 * ie9.css
 * [bemtree](http://bem.info/technology/bemtree/current/bemtree/)
 * node.js
 * browser.js (only in [enb](https://github.com/enb-make/enb))
 * browser.js+bemhtml (only in [bem-tools](http://bem.info/tools/bem/bem-tools/))
* Template systems:
 * [bemhtml](http://bem.info/technology/bemhtml/current/intro/)
 * [bh](https://github.com/enb-make/bh) (only in [enb](https://github.com/enb-make/enb))
* Building of HTML.
* Minimization of separate files (only in [enb](https://github.com/enb-make/enb)).

### Installation of dependencies

```generator-bem-stub``` will install all dependencies and libraries after generation of the project.

If you do not want to install dependencies and libraries, use the option ```--skip-install```

```bash
$ yo bem-stub --skip-install
```

### Versions

You can check in the file ```app/templates/config.json``` which versions of the dependencies and libraries ```generator-bem-stub``` uses or click [here](https://github.com/bem/generator-bem-stub/blob/master/app/templates/config.json#L2-L20).

### Questions

Many questions in `generator-bem-stub` depend on the previous ones, for example:

* If you have chosen [bem-components](http://bem.info/libs/bem-components/current/) library, `generator-bem-stub` will choose `CSS` pre-processor [stylus](https://github.com/LearnBoost/stylus) as default.

* You can choose [bh](https://github.com/enb-make/bh) template system, only if you have chosen [enb](https://github.com/enb-make/enb) collector.

* If you have not chosen technology [bemjson.js](http://bem.info/technology/bemjson/current/bemjson/), bundles will be collected from [bemdecl.js](http://bem.info/technology/bemjson/current/bemjson/).

* You can build `HTML`, only if you have chosen technology [bemjson.js](http://bem.info/technology/bemjson/current/bemjson/) and [bemhtml](http://bem.info/technology/bemhtml/current/intro/) or [bh](https://github.com/enb-make/bh) template system.

* You will be able to choose which separate files to minimize, only if you have chosen [enb](https://github.com/enb-make/enb) collector (In [bem-tools](http://bem.info/tools/bem/bem-tools/) minimization is not configurable, all possible files are minimized by [borschik](http://bem.info/tools/optimizers/borschik/)).

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
