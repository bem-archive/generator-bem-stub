'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    fs = require('fs');

var BemGenerator = module.exports = function BemGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.option('skip-install', {
        desc: 'Skip the install of dependencies and libraries after generation of the project',
        type: Boolean,
        required: 'false'
    });

    this.on('end', function () {
        if (!this.options['skip-install']) {
            this.log.write('').info(' ==> npm and bower install...').write('');
            this.shell.exec('cd ' + this.projectName + ' && npm i');
        }

        this.log.write('').ok('Done!');
        setTimeout(process.exit, 0, 0);   // force exit
    });
};

util.inherits(BemGenerator, yeoman.generators.Base);

BemGenerator.prototype.askFor = function askFor() {

    /**
     * Returns a version of a library from 'config.json'
     * @param {String} base
     * @param {String} value
     * @returns {String}
     */
    function getLibVersion(base, value) {
        return JSON.parse(_this.readFileAsString(configPath)).versions[base][value];
    }

    /**
     * Checks whether a given list of libs has 'bem-components' one
     * @param {Array} addLibraries
     * @returns {Boolean}
     */
    function hasBemComponents(addLibraries) {
        for (var lib in addLibraries) {
            if (addLibraries[lib].name === 'bem-components') return true;
        }

        return false;
    }

    var cb = this.async(),
        _this = this,
        configPath = path.join(_this.sourceRoot(), 'config.json'); // app/templates/config.json

    // questions to a user
    var prompts = [{
        type: 'input',
        name: 'projectName',
        message: 'How to name the project?',
        validate: function(input) {
            return !input.match(/[^0-9a-zA-Z._-]/g) ? true : 'Please, enter a valid value';
        },
        default: 'project-stub'
    }, {
        type: 'input',
        name: 'author',
        message: 'Who will mantain this project?',
        default: _this.user.git.username || 'Ivan Ivanov'
    }, {
        type: 'input',
        name: 'email',
        message: 'What email to use?',
        default: _this.user.git.email || 'ivan@yandex.com'
    }, {
        type: 'list',
        name: 'collector',
        message: 'What collector to use?',
        choices: [{
            value: 'bem-tools'
        }, {
            name: 'ENB',
            value: 'enb'
        }]
    }, {
        type: 'list',
        name: 'baseLibrary',
        message: 'What base library to use?',
        choices: function() {
            var choices = [];

            choices.push({
                name: 'bem-core',
                value: {
                    name: 'bem-core',
                    version: getLibVersion('core', 'bem-core')
                }
            });

            return choices;
        }
    }, {
        type: 'checkbox',
        name: 'addLibraries',
        message: 'Would you like any additional libraries?',
        choices: function(input) {  // 'bem-core' ==> 'bem-components'
            var choices = [];

            choices.push({
                name: 'bem-components',
                value: {
                    name: 'bem-components',
                    version: getLibVersion('core', 'bem-components')
                }
            });

            return choices;
        }
    }, {
        type: 'confirm',
        name: 'design',
        message: 'Use design + autoprefixer from library \'bem-components\'?',
        default: true,
        when: function(input) {     // 'bem-components' ==> 'design'

            return hasBemComponents(input.addLibraries);
        }
    }, {
        type: 'checkbox',
        name: 'platforms',
        message: 'What platforms to use?',
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
        validate: function(input) {
            return input.length > 0 ? true : 'Please, select something';
        }
    }, {
        type: 'list',
        name: 'preprocessor',
        message: 'What CSS pre-processor to use?',
        choices: function(input) {

            // returns the list of possible preprocessors to choose in dependence of the previous answers
            return [{
                value: 'stylus'
            }, {
                value: 'roole',
            }, {
                value: 'less',
            }, {
                name: 'Only pure css',
                value: 'css'
            }];
        },
        when: function(input) {    // 'bem-components' ==> 'stylus' as default

            return !(hasBemComponents(input.addLibraries));
        }
    }, {
        type: 'checkbox',
        name: 'techs',
        message: 'What technologies to use?',
        choices: function(input) {
            // returns the list of possible technologies to choose in dependence of the previous answers
            var collector = require('.' + path.sep + path.join('lib', input.collector === 'bem-tools' ? 'bem-tools' : 'enb'));

            return collector.commonTechs.concat(collector.templates.core, collector.scripts.coreWithoutLocal);
        }
    }, {
        type: 'list',
        name: 'templateSystem',
        message: 'What template system to use?',
        choices: function(input) {
            var choices = [{
                value: 'bemhtml'
            }, {
                name: 'My template system',
                value: 'my'
            }];

            input.collector === 'enb' && choices.splice(1, 0, { value: 'bh' });

            return choices;
        }
    }, {
        type: 'confirm',
        name: 'html',
        message: 'Build static HTML?',
        default: true,
        when: function(input) { // 'bemjson.js' --> 'bemhtml' || 'bh' ==> 'html'

            return input.templateSystem !== 'my' && input.techs.indexOf('bemjson.js') > -1;
        }
    }, {
        type: 'checkbox',
        name: 'minimization',
        message: 'What files to minimize?',
        choices: function(input) {
            var toMinimize = [{ value: 'css' }];

            input.techs.map(function(tech) {
                if (tech === 'browser.js') {
                    toMinimize.push({ value: 'js' });

                    return;
                }

                tech !== 'bemjson.js' && toMinimize.push({ value: tech });
            });

            var templSys = input.templateSystem;
            (templSys && templSys !== 'my') && toMinimize.push({ value: templSys + '.js' });

            return toMinimize;
        },
        when: function(input) { // 'ENB' ==> minimization
            return input.collector === 'enb';
        }
    }];

    function getAnswers(props) {

        var collector = require('.' + path.sep + path.join('lib', (_this.collectorName = props.collector) === 'bem-tools' ? 'bem-tools' : 'enb'));

        // General information
        _this.author = props.author;
        _this.email = props.email;
        _this.projectName = props.projectName;

        // Libraries
        _this.libs = props.addLibraries;

        _this.libsToBowerDeps = [];     // to 'bower.json'
        props.addLibraries.forEach(function(elem) {
            _this.libsToBowerDeps.push(elem);
        });

        _this.libs.unshift(props.baseLibrary);  // base lib on the top (for 'bem-tools' it is vital)


        hasBemComponents(_this.libsToBowerDeps) ||
            _this.libsToBowerDeps.unshift(props.baseLibrary); // 'bem-components' will automatically install 'bem-core'

        // Platforms
        var platforms = collector.getPlatforms(props.platforms, _this.libs, props.design);

        _this.platforms = {
            withPath :  platforms.withPath,     // 'bem-core/common.blocks'
            withoutPath : platforms.withoutPath // 'common'
        };

        // Minimization (this is needed only for 'ENB')
        _this.collectorName === 'enb' && (_this.toMinify = props.minimization);

        // Technologies
        var preprocessor = props.preprocessor,
            techs = props.techs;

        techs = collector.addPreprocessor(techs, preprocessor);

        _this.collectorName === 'bem-tools' && (techs = collector.addIe(techs)); // 'bem-tools' --> 'ieN' ==> 'ie.css'

        techs = collector.addTemplateSystem(techs, props.templateSystem); // bem-core' ==> 'bemhtml', 'bh'

        props.html && techs.push('html');

        _this.technologies = collector.getTechnologies(configPath, techs, _this.toMinify);

        _this.isBemjson = techs.indexOf('bemjson.js') > -1;

        // Preprocessor (this is needed only for 'bem-tools')
        _this.hasPreprocessor = preprocessor !== 'css';
        _this.hasPreprocessor && (_this.preprocessor = !preprocessor ? 'stylus' : preprocessor);

        // Design
        _this.design = props.design;

        // Autoprefixer (will be added to the generated config when 'design' is 'true')
        // @TODO: create the separate question about autoprefixer
        _this.browsers = collector.getBrowsers(configPath, _this.platforms.withoutPath);

        // Styles and scripts to 'bemjson.js'
        var technologies = _this.collectorName === 'bem-tools' ? _this.technologies.inMake.techs : _this.technologies.inTargets;

        _this.styles = collector.getStyles(technologies);
        _this.scripts = collector.getScripts(technologies);

        cb();
    }

    //--------------------START--------------------//

    _this.prompt(prompts, function(props) { getAnswers(props); }.bind(_this));

    //---------------------------------------------//
};

BemGenerator.prototype.app = function app() {

    var _this = this,
        platforms = _this.platforms.withoutPath,
        root = path.join(_this.sourceRoot(), _this.collectorName), // path to the templates
        files = _this.expandFiles('**', { dot: true, cwd: root });   // roots of the all files in the templates

    // Makes the necessary empty folders in the created project (only for 'ENB')
    if (_this.collectorName === 'enb') {
        _this.mkdir(path.join(_this.projectName, 'common.blocks'));
        (platforms['touch-pad'] || platforms['touch-phone']) && _this.mkdir(path.join(_this.projectName, 'touch.blocks'));

        Object.keys(platforms).forEach(function(platform) {
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
            Object.keys(platforms).forEach(function(platform) {
                var pl = platforms[platform];

                names.push(path.join(pl[pl.length - 1] + ending, folder));
            });

            return names;
        }

        var dirnames = [];
        dirnames.push(path.dirname(f));

        if (_this.isBemjson && f === path.join('bundles', 'index', 'index.bemdecl.js')) return;

        if (!_this.isBemjson && f === path.join('bundles', 'index', 'index.bemjson.js')) return;

        // only for 'bem-tools'
        if (f === path.join('blocks', '.bem', 'level.js')) {
            dirnames = [];

            dirnames.push(path.join('common.blocks', 'bem'));
            (platforms['touch-pad'] || platforms['touch-phone']) && dirnames.push(path.join('touch.blocks', '.bem'));

            dirnames = dirnames.concat(formDirnames('.blocks', '.bem'));
        }

        (f === path.join('bundles', 'index', 'index.bemdecl.js') ||
            f === path.join('bundles', 'index', 'index.bemjson.js')) && (dirnames = formDirnames('.bundles', 'index'));

        // only for 'bem-tools'
        (f === path.join('bundles', '.bem', 'level.js')) && (dirnames = formDirnames('.bundles', '.bem'));

        var src = path.join(root, f);   // copy from

        dirnames.map(function(dirname) {
            var dest = path.join(_this.destinationRoot(), _this.projectName, dirname, path.basename(f));  // where to copy
            _this.template(src, dest);
        });
    }.bind(_this));
};

// Adds dependencies to 'package.json'
BemGenerator.prototype.addPackages = function addPackages() {

    /**
     * Returns a version of a library from 'config.json'
     * @param {String} base
     * @param {String} value
     * @returns {String}
     */
    function getLibVersion(base, value) {
        return JSON.parse(_this.readFileAsString(configPath)).versions[base][value];
    }

    var _this = this,
        configPath = path.join(_this.sourceRoot(), 'config.json'), // app/templates/config.json
        packagePath = path.join(_this.destinationRoot(), _this.projectName, 'package.json'),    // path to 'package.json' in the created project
        pack = JSON.parse(_this.readFileAsString(packagePath)),
        deps = pack.devDependencies,
        inJSON = _this.technologies.inJSON;

    inJSON.map(function(_package) {
        deps[_package] = getLibVersion('other', _package);
    });

    // autoprefixer
    _this.collectorName === 'bem-tools' &&
        this.hasPreprocessor && (deps['bem-tools-autoprefixer'] = getLibVersion('other', 'bem-tools-autoprefixer'));
    _this.collectorName === 'enb' &&
        _this.hasPreprocessor && (deps['enb-autoprefixer'] = getLibVersion('other', 'enb-autoprefixer'));

    fs.writeFileSync(packagePath, JSON.stringify(pack, null, '  ') + '\n');
};
