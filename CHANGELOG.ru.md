История изменений
==================

0.9.0
-----

* В случае выбора [bem-tools](http://ru.bem.info/tools/bem/bem-tools/) в качестве сборщика, результаты сборки будут аналогичны выбору сборщика [ENB](https://github.com/enb-make/enb). `bem-tools` проксирует вызовы `ENB`.
* Обновлены все библиотеки и зависимости до последних версий.

0.8.1
-----

* Исправлена ошибка при подключении модуля [Автопрефиксер](https://github.com/postcss/autoprefixer) (подробнее [#131]).

0.8.0
-----

* Библиотека [bem-components](http://bem.info/libs/bem-components/) обновлена до `v2.2.1`.

0.7.1
-----

* Обновлены зависимости (подробнее [#123]).

0.7.0
-----

* Библиотека [bem-core](http://bem.info/libs/bem-core/) обновлена до `v2.6.0`.
* Библиотека [bem-components](http://bem.info/libs/bem-components/) обновлена до `v2.1.0`.

0.6.0
-----

* CSS-препроцессор [Less](https://github.com/less/less.js) больше не поддерживается.
* Исправлен скрипт `postinstall` в файле `package.json` генерируемого проекта (подробене [#107]).
* Обновлены зависимости (подробнее [#114]).

0.5.0
-----

* Удален вопрос про **базовую библиотеку**. В качестве базовой библиотеки теперь всегда используется [bem-core](http://ru.bem.info/libs/bem-core/current/).
* Добавлен скрипт `npm start` для запуска сервера в сгенерированном проекте.

0.4.0
-----

* Добавлена опция `tab-size`.

0.3.0
-----

* Библиотека [bem-components](http://ru.bem.info/libs/bem-components/current/) обновлена до `v2.0.0`.
* Обновлены прочие зависимости.

0.2.2
-----

* Исправлена генерация файла `.gitignore`.

0.2.1
-----

* Исправлена генерация папок типа `*.bundles`.
* Обновлены [зввисимости](https://github.com/bem/generator-bem-stub/commit/7113c13541c36ed510f259a5767747c12ef85624).

0.2.0
-----

* Исправлена работа генартора на Windows OS.
* Переход на использование [enb-bem-techs](http://ru.bem.info/tools/bem/enb-bem-techs/) при генерации проэктов на [ENB](https://github.com/enb-make/enb).
* Исправлена конфигурация шаблонизаторов на [ENB](https://github.com/enb-make/enb).
* Исправлена генерация файлов `.gitignore` и `bower.json`.
* Удалены технологии:
 * ie6.css
 * ie7.css
 * [Roole](https://github.com/curvedmark/roole)

0.1.1
-----

* Исправлена генерация конфига для технологии `node.js`.

0.1.0
-----

* Переход на использование [Stylus](https://github.com/LearnBoost/stylus) в качестве CSS-препроцессора по умолчанию в библиотеке [bem-components](http://ru.bem.info/libs/bem-components/current/).
* Переименована опция `no-deps` в `skip-install`.
* Отрефакторены вопросы к пользоателю:
 * Создан отдельный вопрос о шаблонизаторах для сборщика [bem-tools](http://ru.bem.info/tools/bem/bem-tools/).
 * Создан отдельный вопрос об [Автопрефиксере](https://github.com/postcss/autoprefixer).
* Исправлена генерация файла `bemjson.js`. Не имеет значия, какой сборщик вы используете, `bemjson.js` будет сгенерирован одинаковый в обоих случаях.
* Обновлены версии зависимостей и библиотек.
* Исправлены баги.

[#131]: https://github.com/bem/generator-bem-stub/issues/131
[#107]: https://github.com/bem/generator-bem-stub/issues/107
[#114]: https://github.com/bem/generator-bem-stub/pull/114/files
[#123]: https://github.com/bem/generator-bem-stub/pull/123/files
