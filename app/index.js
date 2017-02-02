'use strict';
var path = require('path'),
    shell = require('shelljs'),
    yeoman = require('yeoman-generator'),
    assembler = require('./lib/enb');

require('colors');

/**
 * @class BemGenerator
 * @extends Base
 */
var BemGenerator = yeoman.generators.Base.extend({

    /**
     * @constructor
     */
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        this.option('skip-install', {
            desc: 'Skip the installation of dependencies and libraries after generation of the project',
            type: Boolean,
            defaults: false
        });
        this.option('tab-size', {
            desc: 'Tab size of the generated code in spaces. Specify 0 to generate tabs instead of spaces',
            type: Number,
            defaults: 4
        });

        this.on('end', function () {
            if (!this.options['skip-install']) {
                var msg =
                    '\nI\'m all done. Running ' + 'npm install'.bold.yellow +
                    ' for you to install the required dependencies. ' +
                    'If this fails, try running the command yourself.\n\n'.bold;

                this.log.write(msg);
                shell.exec('cd ' + this.projectName + ' && npm i');
            }

            this.log.write('').ok('Done!');
            setTimeout(process.exit, 0, 0);   // force exit
        });
    },

    /**
     * @public
     */
    initializing: function () {
        var configPath = path.normalize(this.sourceRoot() + '/../config'); // app/config/

        /**
         * @type {{versions: object, techs: object, browsers: object}}
         * @private
         */
        this._config = {
            versions: require(configPath + '/versions'),
            browsers: require(configPath + '/browsers')
        };

        var tabSize = Math.max(0, Math.min(12, this.options['tab-size']));
        if (tabSize) {
            var _origEngine = this.engine;
            this.engine = function () {
                var res = _origEngine.apply(this, arguments);
                return res.replace(/\t/g, new Array(tabSize + 1).join(' '));
            };
        }
    },

    /**
     * @public
     */
    prompting: function () {
        this.prompt(this._getPrompts(), this._onUserInputEnd.bind(this, this.async()));
    },

    /**
     * @returns {Array.<object>}
     * @protected
     */
    _getPrompts: function () {
        var config = this._config,
            isBemComponents = this._isBemComponents;

        return [{
            type: 'input',
            name: 'projectName',
            message: 'Enter your project name:',
            validate: function (input) {
                return !input.match(/[^0-9a-zA-Z._-]/g) ? true : 'Please enter a valid name';
            },
            'default': 'project-stub'
        }, {
            type: 'input',
            name: 'author',
            message: 'Enter a name of the project owner:',
            'default': this.user.git.name() || 'Ivan Ivanov'
        }, {
            type: 'input',
            name: 'email',
            message: 'Enter an email of the project owner:',
            'default': this.user.git.email() || 'ivan@yandex.com'
        }, {
            type: 'checkbox',
            name: 'addLibraries',
            message: 'Specify additional libraries if needed:',
            choices: function () {  // 'bem-core' ==> 'bem-components'
                var choices = [];

                choices.push({
                    name: 'bem-components',
                    value: {
                        name: 'bem-components',
                        version: config.versions.libs['bem-components']
                    }
                });

                return choices;
            }
        }, {
            type: 'confirm',
            name: 'isDesign',
            message: 'Do you want to use design of \'bem-components\' library?',
            'default': true,
            when: function (input) {     // 'bem-components' ==> 'design'
                return isBemComponents(input.addLibraries);
            }
        }, {
            type: 'checkbox',
            name: 'levels',
            message: 'Choose redefinition levels to use:',
            choices: [{
                name: 'desktop',
                value: ['common', 'desktop']
            }, {
                name: 'touch-pad',
                value: ['common', 'touch', 'touch-pad']
            }, {
                name: 'touch-phone',
                value: ['common', 'touch', 'touch-phone']
            }],
            validate: function (input) {
                return input.length > 0 ? true : 'Please select at least one level';
            }
        }, {
            type: 'list',
            name: 'preprocessor',
            message: 'Choose CSS preprocessor:',
            choices: [{
                name: 'Stylus',
                value: 'stylus'
            }, {
                name: 'Only pure CSS',
                value: 'css'
            }],
            when: function (input) {    // 'bem-components' ==> 'stylus' as default
                return !isBemComponents(input.addLibraries);
            }
        }, {
            type: 'confirm',
            name: 'isAutoprefixer',
            message: 'Do you want to use \'Autoprefixer\'?',
            'default': true,
            when: function (input) {
                return !isBemComponents(input.addLibraries);
            }
        }, {
            type: 'checkbox',
            name: 'techs',
            message: 'Choose technologies to be used in the project:',
            choices: [
                { name: 'BEMJSON', value: 'bemjson.js' },
                { value: 'ie.css' },
                { value: 'ie8.css' },
                { value: 'ie9.css' },
                { name: 'BEMTREE', value: 'bemtree' },
                { value: 'node.js' },
                { value: 'browser.js' }
            ]
        }, {
            type: 'list',
            name: 'templateEngine',
            message: 'Choose a template engine:',
            choices: [{
                name: 'BEMHTML',
                value: 'bemhtml'
            }, {
                name: 'BH',
                value: 'bh'
            }]
        }, {
            type: 'confirm',
            name: 'isHtml',
            message: 'Do you want to build static HTML?',
            'default': true,
            when: function (input) { // 'BEMJSON' --> 'bemhtml'
                return input.techs.indexOf('bemjson.js') > -1;
            }
        }, {
            type: 'confirm',
            name: 'isTidyHtml',
            message: 'Do you want to build \'tidy\' HTML?',
            'default': false,
            when: function (input) {
                return input.isHtml;
            }
        }, {
            type: 'checkbox',
            name: 'minimization',
            message: 'Choose types of files to be minimized:',
            choices: function (input) {
                var toMinimize = [{ value: 'css' }];

                input.techs.map(function (tech) {
                    if (tech === 'browser.js') {
                        toMinimize.push({ value: 'js' });

                        return;
                    }

                    if (tech === 'bemtree') {
                        toMinimize.push({ value: 'bemtree.js' });

                        return;
                    }

                    tech !== 'bemjson.js' && toMinimize.push({ value: tech });
                });

                var templSys = input.templateEngine;
                templSys && toMinimize.push({ value: templSys + '.js' });

                return toMinimize;
            }
        }];
    },

    /**
     * Checks whether there is library 'bem-components' in the given libs
     * @param {Array} addLibraries
     * @returns {Boolean}
     * @private
     */
    _isBemComponents: function (addLibraries) {
        for (var lib in addLibraries) {
            if (addLibraries[lib].name === 'bem-components') {
                return true;
            }
        }
        return false;
    },

    /**
     * @param {function} callback
     * @param {object} props
     * @private
     */
    _onUserInputEnd: function (callback, props) {
        var config = this._config;

        // Assembler
        this.assemblerName = props.assembler;

        // Base library
        var baseLibrary = {
            name: 'bem-core',
            version: config.versions.libs['bem-core']
        };

        // General information
        this.author = props.author;
        this.email = props.email;
        this.projectName = props.projectName;

        // Libraries (base lib on the top - for 'bem-tools' it is vital)
        var addLibraries = props.addLibraries,
            isBemComponents = this._isBemComponents(addLibraries),
            allLibraries = [baseLibrary].concat(addLibraries);

        this.libsToBower = isBemComponents ? addLibraries : allLibraries;

        var isAutoprefixer = props.isAutoprefixer || isBemComponents;

        // Levels
        this.levels = assembler.getLevels(props.levels, allLibraries, props.isDesign);

        // Minimization
        this.toMinify = props.minimization;

        // Technologies
        var techs = props.techs;

        techs.push(props.preprocessor || 'stylus');
        techs.push(props.templateEngine);
        props.isHtml && techs.push('html');
        props.isTidyHtml && techs.push('tidy.html');

        this.technologies = assembler.getTechnologies(techs, {
            config: config,
            isAutoprefixer: isAutoprefixer,
            toMinify: this.toMinify
        });

        if (this.assemblerName === 'bem-tools') {
            this.technologies.inJSON.push({
                name: 'bem',
                version: config.versions.deps['bem']
            });
        }

        this.isBemjson = techs.indexOf('bemjson.js') > -1;

        // Autoprefixer
        (this.isAutoprefixer = isAutoprefixer) &&
            (this.browsers = assembler.getBrowsers(config, this.levels.projectLevels));

        // Styles and scripts to 'bemjson.js'
        techs = this.technologies;
        var technologies = techs.inTargets;

        this.styles = assembler.getStyles(technologies);
        this.scripts = assembler.getScripts(technologies);

        callback();
    },

    /**
     * @public
     */
    writing: function () {
        var _this = this,
            projectLevels = _this.levels.projectLevels,
            root = _this.sourceRoot(),
            files = _this.expandFiles('**', { dot: true, cwd: root });   // roots of the all files in the templates

        // Makes the necessary empty folders in the created project (only for 'ENB')
        if (_this.assemblerName === 'enb') {
            _this.mkdir(path.join(_this.projectName, 'common.blocks'));

            (projectLevels['touch-pad'] || projectLevels['touch-phone']) &&
                _this.mkdir(path.join(_this.projectName, 'touch.blocks'));

            Object.keys(projectLevels).forEach(function (level) {
                _this.mkdir(path.join(_this.projectName, level + '.blocks'));
            });
        }

        _this._.each(files, function (filePath) {
            /**
             * Forms dir names for chosen level
             * @param {String} ending
             * @param {String} folder
             * @returns {Array}
             */
            function formDirnames(ending, folder) {
                var names = [];
                Object.keys(projectLevels).forEach(function (level) {
                    var pl = projectLevels[level];

                    names.push(path.join(pl[pl.length - 1] + ending, folder));
                });

                return names;
            }

            /**
             * Returns destination root for template
             * @param {String} dirname
             * @param {String} filePath
             * @returns {String}
             */
            function getDestPath(dirname, filePath) {
                return _this.destinationPath(_this.projectName, dirname, path.basename(filePath));
            }

            if (filePath === 'gitignore') {
                _this.template(filePath, getDestPath('.', '.' + filePath));
                return;
            }

            var dirnames = [];
            dirnames.push(path.dirname(filePath));

            if (!_this._isTemplateNeeded(filePath)) {
                return;
            }

            // only for 'bem-tools'
            if (filePath === ['blocks', '.bem', 'level.js'].join('/')) {
                dirnames = [];

                dirnames.push(['common.blocks', '.bem'].join('/'));

                (projectLevels['touch-pad'] || projectLevels['touch-phone']) &&
                    dirnames.push(['touch.blocks', '.bem'].join('/'));

                dirnames = dirnames.concat(formDirnames('.blocks', '.bem'));
            } else if (filePath === ['bundles', '.bem', 'level.js'].join('/')) {
                dirnames = formDirnames('.bundles', '.bem');
            }

            (filePath === ['bundles', 'index', 'index.bemdecl.js'].join('/') ||
                filePath === ['bundles', 'index', 'index.bemjson.js'].join('/')) &&
                    (dirnames = formDirnames('.bundles', 'index'));

            var src = _this.templatePath(filePath);   // copy from

            dirnames.map(function (dirname) {
                // where to copy
                var dest = getDestPath(dirname, filePath);
                _this.template(src, dest);
            });
        }, _this);
    },

    /**
     * @param {string} filePath
     * @returns {boolean}
     * @protected
     */
    _isTemplateNeeded: function (filePath) {
        if (this.assemblerName === 'enb' &&
            (/^.bem/.test(filePath) ||
                filePath === ['blocks', '.bem', 'level.js'].join('/') ||
                    filePath === ['bundles', '.bem', 'level.js'].join('/'))) {
            return false;
        }

        if (this.isBemjson && filePath === ['bundles', 'index', 'index.bemdecl.js'].join('/')) {
            return false;
        }

        return !(!this.isBemjson && filePath === ['bundles', 'index', 'index.bemjson.js'].join('/'));
    }
});

module.exports = BemGenerator;
