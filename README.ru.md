# generator-bem-stub [![Build Status](https://travis-ci.org/bem/generator-bem-stub.svg)](https://travis-ci.org/bem/generator-bem-stub) [![Coverage Status](https://img.shields.io/coveralls/bem/generator-bem-stub.svg)](https://coveralls.io/r/bem/generator-bem-stub?branch=master) [![Dependency Status](https://david-dm.org/bem/generator-bem-stub.svg)](https://david-dm.org/bem/generator-bem-stub) [![devDependency Status](https://david-dm.org/bem/generator-bem-stub/dev-status.svg)](https://david-dm.org/bem/generator-bem-stub#info=devDependencies)

Генератор [БЭМ](https://ru.bem.info/)-проектов на [Yeoman](http://yeoman.io).

## Введение

Существуют два стандартных сборщика для [БЭМ](https://ru.bem.info/)-проектов: [bem-tools](https://ru.bem.info/tools/bem/bem-tools/) и [ENB](https://github.com/enb-make/enb). Что обычно делает разработчик, создавая новый БЭМ-проект? В первую очередь - пишет конфигурационный файл для сборщика, который он будет использовать. К сожалению, и для `bem-tools`, и для `ENB` это довольно трудоемкий процесс, в ходе которого часто возникают ошибки.

Для экономии времени и снижения порога вхождения в понимание инструментов для сборки, мы создали генератор конфигурационных файлов, который позволяет настраивать сборку без погружения в API инструментов. Этот генератор предоставляет вам возможность получить базу БЭМ-проекта за считаные минуты, просто ответив на вопросы.

## Установка

Для установки генератора выполните команду:

```bash
$ npm install -g generator-bem-stub
```

## Использование

Для запуска функциональности генератора выполните:

```bash
$ yo bem-stub
```

### Опции

* **skip-install** - не устанавливать зависимости и бибилиотеки после генерации проекта (по умолчанию: `false`).

* **tab-size** - размер символов табуляции в сгенерированном коде. Укажите `0`, чтобы генерировались символы табуляции вместо пробелов (по умолчанию: `4`).

### Пример

```
$ yo bem-stub --skip-install --tab-size=4
```

## Что поддерживает generator-bem-stub?

- Сборщики:
  - [bem-tools](https://ru.bem.info/tools/bem/bem-tools/)
  - [ENB](https://github.com/enb-make/enb)
- Библиотеки:
  - [bem-core](https://ru.bem.info/libs/bem-core/)
  - [bem-components](https://ru.bem.info/libs/bem-components/)
- Платформы:
  - desktop
  - touch-pad
  - touch-phone
- CSS-препроцессоры:
  - [Stylus](https://github.com/LearnBoost/stylus)
- [Автопрефиксер](https://github.com/postcss/autoprefixer)
- Технологии:
  - [BEMJSON](https://ru.bem.info/technology/bemjson/current/bemjson/)
  - [BEMTREE](https://ru.bem.info/technology/bemtree/current/bemtree/)
  - BEMDECL
  - node.js
  - browser.js
- Шаблонизаторы:
  - [BEMHTML](https://ru.bem.info/technology/bemhtml/current/intro/)
  - [BH](https://ru.bem.info/technology/bh/) (доступен только в [ENB](https://github.com/enb-make/enb))
- Сборка HTML
- Минимизиция отдельных файлов (доступна только в [ENB](https://github.com/enb-make/enb))

Чтобы создать оптимальный для вашего проекта конфигурационный файл, генератор задаст несколько вопросов, от которых будет зависеть последующая конфигурация сборки.

Важно знать, что многие вопросы в `generator-bem-stub` зависят друг от друга, например:

* Если вы выбрали библиотеку [bem-components](https://ru.bem.info/libs/bem-components/), `generator-bem-stub` выберет [Автопрефиксер](https://github.com/postcss/autoprefixer) и CSS-препроцессор [Stylus](https://github.com/LearnBoost/stylus) по умолчанию.

* Возможность использования [BH](https://ru.bem.info/technology/bh/)-шаблонизатора появляется только при выборе сборщика [ENB](https://github.com/enb-make/enb).

* Бандлы будут собираться из **BEMDECL**, если вы не выбрали технологию [BEMJSON](https://ru.bem.info/technology/bemjson/current/bemjson/).

* Вы можете собирать HTML, только если выбрали технологию [BEMJSON](https://ru.bem.info/technology/bemjson/current/bemjson/) и шаблонизатор [BEMHTML](https://ru.bem.info/technology/bemhtml/current/intro/) или [BH](https://ru.bem.info/technology/bh/).

* У вас будет возможность выбрать, какие конкретно файлы минимизировать, только если вы выбрали сборщик [ENB](https://github.com/enb-make/enb). ([bem-tools](https://ru.bem.info/tools/bem/bem-tools/) не предоставляет возможность конфигурировать минимизацию файлов, все возможные файлы минимизируются с помощью [borschik](https://ru.bem.info/tools/optimizers/borschik/)).

## Версии

В файле [app/config/versions.js](https://github.com/bem/generator-bem-stub/blob/master/app/config/versions.js) указано, какие версии зависимостей и библиотек использует `generator-bem-stub`.
