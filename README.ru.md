# generator-bem-stub [![Build Status](https://travis-ci.org/bem/generator-bem-stub.svg)](https://travis-ci.org/bem/generator-bem-stub) [![Coverage Status](https://img.shields.io/coveralls/bem/generator-bem-stub.svg)](https://coveralls.io/r/bem/generator-bem-stub?branch=master) [![Dependency Status](https://david-dm.org/bem/generator-bem-stub.svg)](https://david-dm.org/bem/generator-bem-stub) [![devDependency Status](https://david-dm.org/bem/generator-bem-stub/dev-status.svg)](https://david-dm.org/bem/generator-bem-stub#info=devDependencies)

Генератор БЭМ-проектов на [Yeoman](http://yeoman.io).
Дает вам возможность получить базу БЭМ проекта в считаные минуты, отвечая на простые вопросы.

## Установка

```bash
$ npm install -g generator-bem-stub
```

## Использование

Выполните:

```bash
$ yo bem-stub
```

### Что поддержиает generator-bem-stub?

* Сборщики:
 * [bem-tools](http://ru.bem.info/tools/bem/bem-tools/)
 * [enb](https://github.com/enb-make/enb)
* Библиотеки:
 * [bem-core](http://ru.bem.info/libs/bem-core/current/)
 * [bem-components](http://ru.bem.info/libs/bem-components/current/) + design and autoprefixer
* Платформы:
 * desktop
 * touch-pad
 * touch-phone
* CSS пре-процессоры:
 * [stylus](https://github.com/LearnBoost/stylus)
 * [roole](https://github.com/curvedmark/roole)
 * [less](https://github.com/less/less.js)
* Технологии:
 * [bemjson.js](http://ru.bem.info/technology/bemjson/current/bemjson/)
 * ie.css
 * ie6.css
 * ie7.css
 * ie8.css
 * ie9.css
 * [bemtree](http://ru.bem.info/technology/bemtree/current/bemtree/)
 * node.js
 * browser.js (только в [enb](https://github.com/enb-make/enb))
 * browser.js+bemhtml (только в [bem-tools](http://ru.bem.info/tools/bem/bem-tools/))
* Шаблонизаторы:
 * [bemhtml](http://ru.bem.info/technology/bemhtml/current/intro/)
 * [bh](https://github.com/enb-make/bh) (только в [enb](https://github.com/enb-make/enb))
* Сборка HTML.
* Минимизиция отдельных файлов (только в [enb](https://github.com/enb-make/enb)).

### Установка зависимостей

```generator-bem-stub``` установит все зависимости и библиотеки после генерации проекта.

Чтобы не устанавливать зависимости и библиотеки, используйте опцию ```--skip-install```:

```bash
$ yo bem-stub --skip-install
```

### Версии

Вы можете посмотреть в файле ```app/templates/config.json```, какие версии зависимостей и библиотек использует ```generator-bem-stub``` или перейдите по [ссылке](https://github.com/bem/generator-bem-stub/blob/master/app/templates/config.json#L2-L20).

### Вопросы

Многие вопросы в `generator-bem-stub` зависят друг от друга, например:

* Если вы выбрали библиотеку [bem-components](http://ru.bem.info/libs/bem-components/current/), `generator-bem-stub` возьмет `CSS` пре-процессор [stylus](https://github.com/LearnBoost/stylus) по умолчанию.

* Вы можете выбрать шаблонизатор [bh](https://github.com/enb-make/bh), только если выбрали сборщик [enb](https://github.com/enb-make/enb).

* Если вы не выбрали технологию [bemjson.js](http://ru.bem.info/technology/bemjson/current/bemjson/), бандлы будут собираться из [bemdecl.js](http://ru.bem.info/technology/bemjson/current/bemjson/).

* Вы можете собирать `HTML`, только если выбрали технологию [bemjson.js](http://ru.bem.info/technology/bemjson/current/bemjson/) и шаблонизатор [bemhtml](http://ru.bem.info/technology/bemhtml/current/intro/) или [bh](https://github.com/enb-make/bh).

* У вас будет возможность выбрать, какие конкретно файлы минимизировать, только если вы выбрали сборщик [enb](https://github.com/enb-make/enb) ([bem-tools](http://ru.bem.info/tools/bem/bem-tools/) не представляет возможность конфигурировать минимизацию файлов, все возможные файлы минимизируются с помощью [borschik](http://ru.bem.info/tools/optimizers/borschik/)).

## Лицензия

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
