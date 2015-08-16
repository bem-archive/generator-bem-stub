History of changes
==================

0.10.0
------

* Added a question about beautifying HTML. This feature gives the ability to build _tidy_ (formatted and not minimized) HTML.

0.9.0
-----

* In case of choosing [bem-tools](http://bem.info/tools/bem/bem-tools/) assembler, the result files will be the same as in case of choosing of [ENB](https://github.com/enb-make/enb). `bem-tools` just calls `ENB` under the hood.
* Updated all libraries and dependencies to the latest versions.

0.8.1
-----

* Fixed the bug when using [Autoprefixer](https://github.com/postcss/autoprefixer) (see [#131])

0.8.0
-----

* Library [bem-components](http://bem.info/libs/bem-components/) was updated to `v2.2.1`.

0.7.1
-----

* Updated the versions of dependencies (see [#123]).

0.7.0
-----

* Library [bem-core](http://bem.info/libs/bem-core/) was updated to `v2.6.0`.
* Library [bem-components](http://bem.info/libs/bem-components/) was updated to `v2.1.0`.

0.6.0
-----

* CSS preprocessor [Less](https://github.com/less/less.js) is not supported any more.
* Fixed the `postinstall` script in file `package.json` of the generated project (see [#107]).
* Updated the versions of dependencies (see [#114]).

0.5.0
-----

* Removed the question about the **base library**. [bem-core](http://bem.info/libs/bem-core/current/) is included as the base by default.
* Added shortcut `npm start` for starting a server in a generated project.

0.4.0
-----

* Added option `tab-size`.

0.3.0
-----

* Library [bem-components](http://bem.info/libs/bem-components/current/) was updated to `v2.0.0`.
* Updated other dependencies.

0.2.2
-----

* Fixed generation of file `.gitignore`.

0.2.1
-----

* Fixed generation of folders `*.bundles`.
* Updated [dependencies](https://github.com/bem/generator-bem-stub/commit/7113c13541c36ed510f259a5767747c12ef85624).

0.2.0
-----

* Fixed the work of the generator on Windows OS.
* Moved to using [enb-bem-techs](http://ru.bem.info/tools/bem/enb-bem-techs/) in generation of projects for assembler [ENB](https://github.com/enb-make/enb).
* Fixed the configuration of template engines for assembler [ENB](https://github.com/enb-make/enb).
* Fixed the generation of files `.gitignore` and `bower.json`.
* Removed technologies:
 * ie6.css
 * ie7.css
 * [Roole](https://github.com/curvedmark/roole)

0.1.1
-----

* Fixed the generation of config for technolgy `node.js`.

0.1.0
-----

* Moved to using CSS preprocessor [Stylus](https://github.com/LearnBoost/stylus) as default in library [bem-components](http://bem.info/libs/bem-components/current/).
* Renamed option `no-deps` to `skip-install`.
* Refactored the questions to a user:
 * Created the separate question about template engines for assembler [bem-tools](http://bem.info/tools/bem/bem-tools/).
 * Created the separate question about [Autoprefixer](https://github.com/postcss/autoprefixer).
* Fixed the generation of file `bemjson.js`. It will be generated the same no matter what of kind assembler you use.
* Updated the versions of dependencies and libraries.
* Fixed bugs.

[#131]: https://github.com/bem/generator-bem-stub/issues/131
[#107]: https://github.com/bem/generator-bem-stub/issues/107
[#114]: https://github.com/bem/generator-bem-stub/pull/114/files
[#123]: https://github.com/bem/generator-bem-stub/pull/123/files
