'use strict';
var path = require('path'),
    yeoman = require('yeoman-generator');

require('colors');

var BemGenerator = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        this.option('skip-install', {
            desc: 'Skip the installation of dependencies and libraries after generation of the project',
            type: Boolean,
            required: 'false'
        });

        this.on('end', function () {
            if (!this.options['skip-install']) {
                var msg =
                    '\nI\'m all done. Running ' + 'npm install'.bold.yellow +
                    ' for you to install the required dependencies. ' +
                    'If this fails, try running the command yourself.\n\n'.bold;

                this.log.write(msg);
                this.shell.exec('cd ' + this.projectName + ' && npm i');
            }

            this.log.write('').ok('Done!');
            setTimeout(process.exit, 0, 0);   // force exit
        });
    },

    prompting: function () {
        /**
         * Checks whether there is library 'bem-components' in the given libs
         * @param {Array} addLibraries
         * @returns {Boolean}
         */
        function isBemComponents(addLibraries) {
            for (var lib in addLibraries) {
                if (addLibraries[lib].name === 'bem-components') return true;
            }

            return false;
        }

        var cb = this.async(),
            configPath = path.normalize(this.sourceRoot() + '/../config'), // app/config/
            config = {
                versions: require(configPath + '/versions'),
                techs: require(configPath + '/techs'),
                browsers: require(configPath + '/browsers')
            };

        // questions to a user
        var prompts = [{
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
            'default': this.user.git.email || 'ivan@yandex.com'
        }, {
            type: 'list',
            name: 'assembler',
            message: 'Choose a toolkit to build the project:',
            choices: [{
                name: 'ENB',
                value: 'enb'
            }, {
                value: 'bem-tools'
            }]
        }, {
            type: 'list',
            name: 'baseLibrary',
            message: 'Choose a base library:',
            choices: function () {
                var choices = [];

                choices.push({
                    name: 'bem-core',
                    value: {
                        name: 'bem-core',
                        version: config.versions.libs['bem-core']
                    }
                });

                return choices;
            }
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
            name: 'platforms',
            message: 'Choose target platforms:',
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
                return input.length > 0 ? true : 'Please select at least one platform';
            }
        }, {
            type: 'list',
            name: 'preprocessor',
            message: 'Choose CSS preprocessor:',
            choices: function () {
                // returns the list of possible preprocessors to choose in dependence of the previous answers
                return [{
                    name: 'Stylus',
                    value: 'stylus'
                }, {
                    name: 'Less',
                    value: 'less'
                }, {
                    name: 'Only pure CSS',
                    value: 'css'
                }];
            },
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
            choices: function (input) {
                return [
                    { name: 'BEMJSON', value: 'bemjson.js' },
                    { value: 'ie.css' },
                    { value: 'ie8.css' },
                    { value: 'ie9.css' },
                    { name: 'BEMTREE', value: 'bemtree' },
                    { value: 'node.js' },
                    { value: input.assembler === 'bem-tools' ? 'browser.js+bemhtml' : 'browser.js' }
                ];
            }
        }, {
            type: 'list',
            name: 'templateEngine',
            message: 'Choose a template engine:',
            choices: function (input) {
                var choices = [{
                    name: 'BEMHTML',
                    value: 'bemhtml'
                }, {
                    name: 'My template engine',
                    value: 'my'
                }];

                input.assembler === 'enb' && choices.splice(1, 0, { name: 'BH', value: 'bh' });

                return choices;
            }
        }, {
            type: 'confirm',
            name: 'isHtml',
            message: 'Do you want to build static HTML?',
            'default': true,
            when: function (input) { // 'BEMJSON' --> 'bemhtml' || 'bh' ==> 'html'
                return input.templateEngine !== 'my' && input.techs.indexOf('bemjson.js') > -1;
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
                (templSys && templSys !== 'my') && toMinimize.push({ value: templSys + '.js' });

                return toMinimize;
            },
            when: function (input) { // 'ENB' ==> minimization
                return input.assembler === 'enb';
            }
        }];

        this.prompt(prompts, function (props) {
            this.assemblerName = props.assembler === 'bem-tools' ? 'bem-tools' : 'enb';
            var assembler = require(['.', 'lib', this.assemblerName].join('/'));

            // General information
            this.author = props.author;
            this.email = props.email;
            this.projectName = props.projectName;

            // Libraries (base lib on the top - for 'bem-tools' it is vital)
            this.libs = [props.baseLibrary].concat(props.addLibraries);

            var isAutoprefixer = props.isAutoprefixer || isBemComponents(this.libs);

            // Platforms
            var platforms = assembler.getPlatforms(props.platforms, this.libs, props.isDesign);
            this.platforms = {
                withPath: platforms.withPath,           // 'bem-core/common.blocks'
                withoutPath: platforms.withoutPath      // 'common'
            };

            // Minimization (this is needed only for 'ENB')
            this.assemblerName === 'enb' && (this.toMinify = props.minimization);

            // Technologies
            var preprocessor = props.preprocessor,
                techs = props.techs;

            techs = assembler.addPreprocessor(techs, preprocessor) &&
                        assembler.addTemplateEngine(techs, props.templateEngine); // bem-core' ==> 'bemhtml', 'bh'

            this.assemblerName === 'bem-tools' &&
                (techs = assembler.addIe(techs)); // 'bem-tools' --> 'ieN' ==> 'ie.css'

            props.isHtml && techs.push('html');

            this.technologies = assembler.getTechnologies(config, techs, isAutoprefixer, this.toMinify);

            this.isBemjson = techs.indexOf('bemjson.js') > -1;

            // Preprocessor
            this.preprocessor = !preprocessor ? 'stylus' : preprocessor;

            // Autoprefixer
            (this.isAutoprefixer = isAutoprefixer) &&
                (this.browsers = assembler.getBrowsers(config, this.platforms.withoutPath));

            // Styles and scripts to 'bemjson.js'
            techs = this.technologies;
            var technologies = this.assemblerName === 'bem-tools' ? techs.inMake.techs : techs.inTargets;

            this.styles = assembler.getStyles(technologies);
            this.scripts = assembler.getScripts(technologies);

            cb();
        }.bind(this));
    },
    writing: function () {
        var _this = this,
            platforms = _this.platforms.withoutPath,
            root = _this.sourceRoot(),
            files = _this.expandFiles('**', { dot: true, cwd: root });   // roots of the all files in the templates

        // Makes the necessary empty folders in the created project (only for 'ENB')
        if (_this.assemblerName === 'enb') {
            _this.mkdir(path.join(_this.projectName, 'common.blocks'));

            (platforms['touch-pad'] || platforms['touch-phone']) &&
                _this.mkdir(path.join(_this.projectName, 'touch.blocks'));

            Object.keys(platforms).forEach(function (platform) {
                _this.mkdir(path.join(_this.projectName, platform + '.blocks'));
            });
        }

        _this._.each(files, function (f) {
            /**
             * Forms dir names for chosen platforms
             * @param {String} ending
             * @param {String} folder
             * @returns {Array}
             */
            function formDirnames(ending, folder) {
                var names = [];
                Object.keys(platforms).forEach(function (platform) {
                    var pl = platforms[platform];

                    names.push(path.join(pl[pl.length - 1] + ending, folder));
                });

                return names;
            }

            var dirnames = [];
            dirnames.push(path.dirname(f));

            if (_this.assemblerName === 'bem-tools' && f.indexOf('.enb') > -1) return;
            if (_this.assemblerName === 'enb' &&
                (/^.bem/.test(f) ||
                    f === ['blocks', '.bem', 'level.js'].join('/') ||
                        f === ['bundles', '.bem', 'level.js'].join('/'))) return;

            if (_this.isBemjson && f === ['bundles', 'index', 'index.bemdecl.js'].join('/')) return;
            if (!_this.isBemjson && f === ['bundles', 'index', 'index.bemjson.js'].join('/')) return;

            // only for 'bem-tools'
            if (f === ['blocks', '.bem', 'level.js'].join('/')) {
                dirnames = [];

                dirnames.push(['common.blocks', '.bem'].join('/'));

                (platforms['touch-pad'] || platforms['touch-phone']) &&
                    dirnames.push(['touch.blocks', '.bem'].join('/'));

                dirnames = dirnames.concat(formDirnames('.blocks', '.bem'));
            } else if (f === ['bundles', '.bem', 'level.js'].join('/')) {
                (dirnames = formDirnames('.bundles', '.bem'));
            }

            (f === ['bundles', 'index', 'index.bemdecl.js'].join('/') ||
                f === ['bundles', 'index', 'index.bemjson.js'].join('/')) &&
                    (dirnames = formDirnames('.bundles', 'index'));

            var src = path.join(root, f);   // copy from

            dirnames.map(function (dirname) {
                // where to copy
                var dest = path.join(_this.destinationRoot(), _this.projectName, dirname, path.basename(f));
                _this.template(src, dest);
            });
        }.bind(_this));
    }
});

module.exports = BemGenerator;
