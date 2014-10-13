# generator-bem-stub [![Build Status](https://travis-ci.org/bem/generator-bem-stub.svg)](https://travis-ci.org/bem/generator-bem-stub) [![Coverage Status](https://img.shields.io/coveralls/bem/generator-bem-stub.svg)](https://coveralls.io/r/bem/generator-bem-stub?branch=master) [![Dependency Status](https://david-dm.org/bem/generator-bem-stub.svg)](https://david-dm.org/bem/generator-bem-stub) [![devDependency Status](https://david-dm.org/bem/generator-bem-stub/dev-status.svg)](https://david-dm.org/bem/generator-bem-stub#info=devDependencies)

Генератор [БЭМ](http://ru.bem.info/)-проектов на [Yeoman](http://yeoman.io).

## Введение

Существует несколько сборщиков для [БЭМ](http://ru.bem.info/)-проектов — [bem-tools](http://ru.bem.info/tools/bem/bem-tools/) и [ENB](https://github.com/enb-make/enb). Что делает разработчик, начиная новый [БЭМ](http://ru.bem.info/)-проект? В первую очередь разработчик создает конфигурационный файл для сборщика, который он будет использовать. К сожалению, и для [bem-tools](http://ru.bem.info/tools/bem/bem-tools/), и для [ENB](https://github.com/enb-make/enb) — это довольно трудоемкий процесс, в ходе которого часто возникают ошибки.

Для экономии времени и снижения порога вхождения в понимание инструментов для сборки, мы решили создать генератор конфигурационных файлов, который позволяет конфигурировать сборку без погружения в **API** инструментов. Этот генератор предоставляет вам возможность получить базу [БЭМ](http://ru.bem.info/)-проекта за считаные минуты, овтетив на простые вопросы.

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
 * [ENB](https://github.com/enb-make/enb)
* Библиотеки:
 * [bem-core](http://ru.bem.info/libs/bem-core/current/)
 * [bem-components](http://ru.bem.info/libs/bem-components/current/) + design and autoprefixer
* Платформы:
 * desktop
 * touch-pad
 * touch-phone
* CSS-препроцессоры:
 * [Stylus](https://github.com/LearnBoost/stylus)
 * [Roole](https://github.com/curvedmark/roole)
 * [Less](https://github.com/less/less.js)
* [Автопрефиксер](https://github.com/postcss/autoprefixer)
* Технологии:
 * [BEMJSON](http://ru.bem.info/technology/bemjson/current/bemjson/)
 * ie.css
 * ie6.css
 * ie7.css
 * ie8.css
 * ie9.css
 * [BEMTREE](http://ru.bem.info/technology/bemtree/current/bemtree/)
 * node.js
 * browser.js (доступна только в [ENB](https://github.com/enb-make/enb))
 * browser.js+bemhtml (доступна только в [bem-tools](http://ru.bem.info/tools/bem/bem-tools/))
* Шаблонизаторы:
 * [BEMHTML](http://ru.bem.info/technology/bemhtml/current/intro/)
 * [BH](https://github.com/enb-make/bh) (доступен только в [ENB](https://github.com/enb-make/enb))
* Сборка HTML
* Минимизиция отдельных файлов (доступна только в [ENB](https://github.com/enb-make/enb))

### Установка зависимостей

`generator-bem-stub` установит все зависимости и библиотеки после генерации проекта.

Чтобы не устанавливать зависимости и библиотеки, используйте опцию `--skip-install`:

```bash
$ yo bem-stub --skip-install
```

### Версии

Вы можете посмотреть в файле [app/config/config.json](https://github.com/bem/generator-bem-stub/blob/master/app/config/config.json#L2-L21), какие версии зависимостей и библиотек использует `generator-bem-stub`.

### Важно знать

Многие вопросы в `generator-bem-stub` зависят друг от друга, например:

* Если вы выбрали библиотеку [bem-components](http://ru.bem.info/libs/bem-components/current/), `generator-bem-stub` выберет [Автопрефиксер](https://github.com/postcss/autoprefixer) и CSS-препроцессор [Stylus](https://github.com/LearnBoost/stylus) по умолчанию.

* Возможность использования [BH](https://github.com/enb-make/bh)-шаблонизатора появляется только при выборе сборщика [ENB](https://github.com/enb-make/enb).

* Бандлы будут собираться из [BEMDECL](http://ru.bem.info/technology/bemjson/current/bemjson/), если вы не выбрали технологию [BEMJSON](http://ru.bem.info/technology/bemjson/current/bemjson/).

* Вы можете собирать HTML, только если выбрали технологию [BEMJSON](http://ru.bem.info/technology/bemjson/current/bemjson/) и шаблонизатор [BEMHTML](http://ru.bem.info/technology/bemhtml/current/intro/) или [BH](https://github.com/enb-make/bh).

* У вас будет возможность выбрать, какие конкретно файлы минимизировать, только если вы выбрали сборщик [ENB](https://github.com/enb-make/enb) ([bem-tools](http://ru.bem.info/tools/bem/bem-tools/) не представляет возможность конфигурировать минимизацию файлов, все возможные файлы минимизируются с помощью [borschik](http://ru.bem.info/tools/optimizers/borschik/)).
