# generator-bem-stub [![Build Status](https://travis-ci.org/bem/generator-bem-stub.svg)](https://travis-ci.org/bem/generator-bem-stub) [![Coverage Status](https://img.shields.io/coveralls/bem/generator-bem-stub.svg)](https://coveralls.io/r/bem/generator-bem-stub?branch=master) [![Dependency Status](https://david-dm.org/bem/generator-bem-stub.svg)](https://david-dm.org/bem/generator-bem-stub) [![devDependency Status](https://david-dm.org/bem/generator-bem-stub/dev-status.svg)](https://david-dm.org/bem/generator-bem-stub#info=devDependencies)

Генератор [БЭМ](https://ru.bem.info/)-проектов на [Yeoman](http://yeoman.io).

<!-- TOC -->
- [Введение](#Введение)
- [Установка](#Установка)
- [Обновление](#Обновление)
- [Использование](#Использование)
  - [Опции](#Опции)
  - [Пример](#Пример)
- [Что поддерживает generator-bem-stub?](#Что-поддерживает-generator-bem-stub)
- [Версии](#Версии)

<!-- TOC END -->

## Введение

Существуют два стандартных сборщика для [БЭМ](https://ru.bem.info/)-проектов: [ENB](https://ru.bem.info/tools/bem/enb-bem/) и [bem-tools](https://ru.bem.info/tools/bem/bem-tools/) — комбайн, который под капотом использует `ENB` для сборки и предоставляет дополнительные команды для работы с файлами по БЭМ.

Что обычно делает разработчик, создавая новый БЭМ-проект? В первую очередь - пишет конфигурационный файл для сборщика, который он будет использовать. Это довольно трудоемкий процесс, в ходе которого часто возникают ошибки.

Для экономии времени и снижения порога входа в сборку, мы создали генератор конфигурационных файлов, который позволяет настраивать сборку без погружения в API инструментов. Этот генератор предоставляет вам возможность получить заготовку БЭМ-проекта за считаные минуты, просто ответив на вопросы.

## Установка

Для установки генератора выполните команду:

```bash
$ npm install -g generator-bem-stub
```

Если вы используете **`npm@>=3.0.0`**, то перед установкой генератора выполните:

```bash
$ npm install -g yo
```

**ЗАМЕЧАНИЕ!** Глобальная установка (с флагом `-g`) обязательна в обоих случаях.

## Обновление

Для обновления генератора выполните команду:

```bash
$ npm update -g generator-bem-stub
```

## Использование

Для запуска генератора выполните:

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

## Что поддерживает `generator-bem-stub`?

- Сборщики:
  - [ENB](https://github.com/enb-make/enb)
  - [bem-tools](https://ru.bem.info/tools/bem/bem-tools/)
- Библиотеки:
  - [bem-core](https://ru.bem.info/libs/bem-core/)
  - [bem-components](https://ru.bem.info/libs/bem-components/)
- Уровни переопределения:
  - desktop
  - touch-pad
  - touch-phone
- CSS-препроцессоры:
  - [Stylus](https://github.com/stylus/stylus)
- [Автопрефиксер](https://github.com/postcss/autoprefixer)
- Технологии:
  - [BEMJSON](https://ru.bem.info/technology/bemjson/)
  - [BEMTREE](https://ru.bem.info/technology/bemtree/)
  - BEMDECL
  - node.js
  - browser.js
- Шаблонизаторы:
  - [BEMHTML](https://ru.bem.info/technology/bemhtml/)
  - [BH](https://ru.bem.info/technology/bh/)
- Сборка HTML
- Сборка _опрятного_ (отформатированного и неминимизированного) HTML с помощью [enb-beautify](https://github.com/enb-make/enb-beautify)
- Минимизиция отдельных файлов

Чтобы создать оптимальный для вашего проекта конфигурационный файл, генератор задаст несколько вопросов.

Важно знать, что многие вопросы в `generator-bem-stub` зависят друг от друга, например:

* Если вы выбрали библиотеку [bem-components](https://ru.bem.info/libs/bem-components/), `generator-bem-stub` выберет [Автопрефиксер](https://github.com/postcss/autoprefixer) и CSS-препроцессор [Stylus](https://github.com/stylus/stylus) по умолчанию.

* Бандлы будут собираться из **BEMDECL**, если вы не выбрали технологию [BEMJSON](https://ru.bem.info/technology/bemjson/current/bemjson/).

* Вы можете собирать HTML, только если выбрали технологию [BEMJSON](https://ru.bem.info/technology/bemjson/current/bemjson/) и шаблонизатор [BEMHTML](https://ru.bem.info/technology/bemhtml/current/intro/) или [BH](https://ru.bem.info/technology/bh/).

**ЗАМЕЧАНИЕ!** [bem-tools](https://ru.bem.info/tools/bem/bem-tools/) использует `ENB` для команды `make`. Если вы выберете его, то конфигурационный файл будет создан для сборщика `ENB`, но у вас будет возможность использовать [команды](https://ru.bem.info/tools/bem/bem-tools/commands/) из bem-tools.

## Версии

В файле [app/config/versions.js](./app/config/versions.js) указано, какие версии зависимостей и библиотек использует `generator-bem-stub`.
