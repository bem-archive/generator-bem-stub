'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    fs = require('fs');

var BemGenerator = module.exports = function BemGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, path.join('..', 'package.json'))));
    this.username = this.user.git.email.split('@')[0] || this.shell.exec('whoami').output.trim();

    this.on('end', function () {
        this.log.write('').ok('Done!');
        setTimeout(process.exit, 0, 0);   // force exit
    });
};

util.inherits(BemGenerator, yeoman.generators.Base);

BemGenerator.prototype.askFor = function askFor() {

    var cb = this.async(),
        _this = this,
        configPath = path.join(_this.sourceRoot(), 'config.json');

    function getLibVersion(base, value) {
        return JSON.parse(_this.readFileAsString(configPath)).versions[base][value];
    }

    function hasBemComponents(addLibraries) {
        var hasBemComponents = false;

        addLibraries.map(function(lib) {
            lib.name === 'bem-components' && (hasBemComponents = true);
        });

        return hasBemComponents;
    }

    // questions to user
    var prompts = [{
        type: 'input',
        name: 'projectName',
        message: "How to name the project?",
        validate: function(input) {
            return !input.match(/[^0-9a-zA-Z._-]/g) ? true : 'Please, enter a valid value';
        },
        default: 'project-stub'
    }, {
        type: 'input',
        name: 'author',
        message: "Who will mantain this project?",
        default: _this.user.git.username || 'Ivan Ivanovich'
    }, {
        type: 'input',
        name: 'email',
        message: "What email to use?",
        default: _this.user.git.email || 'ivan@yandex-team.ru'
    }, {
        type: 'list',
        name: 'collector',
        message: "What collector to use?",
        choices: [{
            value: 'bem-tools'
        }, {
            value: 'enb'
        }]
    }, {
        type: 'list',
        name: 'baseLibrary',
        message: "What base library to use?",
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
        message: "Would you like any additional libraries?",
        choices: function(input) {  // 'bem-core' ==> 'bem-components'
            var choices = [];

            choices.push({
                name: 'bem-components',
                value: {
                    name: 'bem-components',
                    version: getLibVersion('core', input.collector === 'enb' ? 'enb-bem-components' : 'bem-components')
                }
            });

            return choices;
        }
    }, {
        type: 'checkbox',
        name: 'platforms',
        message: "What platforms to use?",
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
        type: 'confirm',
        name: 'design',
        message: "Use design from bem-components?",
        default: true,
        when: function(input) {     // 'bem-core' --> 'bem-components' ==> 'design'

            return hasBemComponents(input.addLibraries);
        }
    }, {
        type: 'list',
        name: 'preprocessor',
        message: "What preprocessor to use?",
        choices: function(input) {
            // returns the list of possible preprocessors in dependence of the previous answers

            if (input.collector === 'enb') {
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
            }

            return [{
                value: 'roole'
            }, {
                name: 'Only pure css',
                value: 'css'
            }];
        },
        when: function(input) {    // 'bem-tools' -> 'bem-components' -> 'design' ==> 'roole' | 'enb' -> 'bem-components' ==> 'stylus'

            return !(input.design || (input.collector === 'enb' && hasBemComponents(input.addLibraries)));
        }
    }, {
        type: 'checkbox',
        name: 'techs',
        message: "What technologies to use?",
        choices: function(input) {
            // returns the list of possible technologies to choose in dependence of the previous answers
            var collector = require('.' + path.sep + path.join('lib', input.collector === 'bem-tools' ? 'tools' : 'enb'));

            return collector.commonTechs.concat(collector.templates.core, collector.scripts.coreWithoutLocal);
        }
    }, {
        type: 'list',
        name: 'templateSystem',
        message: "What template system to use?",
        choices: [{
            name: 'bemhtml',
            value: 'bemhtml'
        }, {
            value: 'bh'
        }, {
            name: 'My template system',
            value: 'my'
        }],
        when: function(input) { // 'enb' --> 'bem-core' ==> 'template system'
            return input.collector === 'enb';
        }
    }, {
        type: 'confirm',
        name: 'html',
        message: "Build static html?",
        default: true,
        when: function(input) { // 'bemjson' --> 'template system' ==> 'html'
            if (input.collector === 'bem-tools') return input.techs.indexOf('bemjson.js') > -1 && input.techs.indexOf('bemhtml') > -1;

            else return (input.templateSystem && (input.templateSystem !== 'my' || input.techs.indexOf('bemhtml.js') > -1) &&
                input.techs.indexOf('bemjson.js') > -1)
        }
    }, {
        type: 'checkbox',
        name: 'minimization',
        message: "What files to minimize?",
        choices: function(input) {
            var toMinimize = [ { value: 'css' } ];

            input.techs.map(function(tech) {
                if (tech === 'browser.js') {
                    toMinimize.push( { value: 'js' } );
                    return;
                }

                tech !== 'bemjson.js' && toMinimize.push( { value: tech } );
            });

            var templSys = input.templateSystem;
            (templSys && templSys !== 'my') && toMinimize.push( { value: templSys + '.js' } );

            return toMinimize;
        },
        when: function(input) {
            return input.collector === 'enb';
        }
    }];

    function getAnswers(props) {

        var collector = require('.' + path.sep + path.join('lib', (_this.collectorName = props.collector) === 'bem-tools' ? 'tools' : 'enb'));

        // General information
        // -------------------

        _this.author = props.author;
        _this.email = props.email;
        _this.projectName = props.projectName;

        // -------------------


        // Libraries
        // ---------

        _this.libs = props.addLibraries;

        _this.libsToBowerDeps = [];     // to 'bower.json'
        props.addLibraries.forEach(function(elem) {
            _this.libsToBowerDeps.push(elem);
        })

        _this.libs.unshift(props.baseLibrary);  // base lib on the top

        !hasBemComponents(_this.libsToBowerDeps) && _this.libsToBowerDeps.unshift(props.baseLibrary); // 'bem-components' will automatically install 'bem-core'

        // ---------


        // Platforms
        // ---------

        var platforms = collector.getPlatforms(props.platforms, _this.libs, props.design);

        // 'withPath' ==> 'bem-core/common.blocks' | 'withoutPath' ==> 'common'
        _this.platforms = {
            withPath :  platforms.withPath,
            withoutPath : platforms.withoutPath
        }

        // ---------


        // Minimization
        // ------------

        props.minimization && (_this.toMinify = props.minimization);

        // ------------


        // Technologies
        // ------------

        props.techs = collector.addPreprocessor(props.techs, props.preprocessor);

        // 'bem-tools' --> 'ieN' ==> 'ie.css'
        _this.collectorName === 'bem-tools' && (props.techs = collector.addIe(props.techs));

        // 'enb' --> 'bem-core' ==> 'bemhtml', 'bh'
        props.templateSystem && props.templateSystem !== 'my' && props.techs.push(props.templateSystem);

        props.html && props.techs.push('html');

        _this.technologies = collector.getTechnologies(configPath, props.techs, _this.toMinify);

        _this.isBemjson = props.techs.indexOf('bemjson.js') > -1;

        // ------------


        // Preprocessor
        // ------------

        _this.preprocessor = props.preprocessor !== 'css';

        // ------------

        // Roole
        // -----

        _this.roole = (_this.collectorName === 'bem-tools' && (props.preprocessor === 'roole' || props.design));

        // -----


        // Design
        // ------

        _this.design = props.design;

        // ------


        // Autoprefixer
        // ------------

        _this.browsers = collector.getBrowsers(configPath, _this.platforms.withoutPath);

        // ------------


        // enb ==> 'index.bemjson.js'
        // --------------------------

        _this.collectorName === 'enb' && (_this.scripts = collector.getScripts(_this.technologies.inTargets));

        // --------------------------

        cb();
    }

    //--------------------START--------------------//

    var params = {
        first: process.argv[3],
        second: process.argv[4],
        third: process.argv[5]
    }

    _this.npmi = true;

    try {
        if (params.third) throw e;

        switch (params.first) {
            case '--no-deps':
                _this.npmi = false;
                if (params.second) throw e;
                break;
            default:
                /*
                    'answersFromJSON' !== 'undefined' when a valid path to 'JSON-file' was given as a first parameter,
                    for example, 'yo bem-stub test.json'
                */
                var answersFromJSON = params.first && JSON.parse(_this.readFileAsString(params.first));

                _this.npmi = !(params.second === '--no-deps')

                if (params.second && _this.npmi) throw e;
        }
    }
    catch(e) {
        this.log.error('Invalid parameter');
        process.exit(1);
    }

    answersFromJSON ?
        getAnswers(answersFromJSON) :
        _this.prompt(prompts, function(props) { getAnswers(props); }.bind(_this));

    //---------------------------------------------//
};

BemGenerator.prototype.app = function app() {

    var _this = this,
        platforms = _this.platforms.withoutPath,
        root = path.join(_this.sourceRoot(), _this.collectorName), // path to templates
        files = _this.expandFiles('**', { dot: true, cwd: root });   // roots of all files

    // Makes the necessary empty folders in the created project
    _this.mkdir(path.join(_this.projectName, 'common.blocks'));

    (platforms['touch-pad'] || platforms['touch-phone']) && _this.mkdir(path.join(_this.projectName, 'touch.blocks'));

    _this.collectorName === 'enb' &&
        Object.keys(platforms).forEach(function(platform) {
            _this.mkdir(path.join(_this.projectName, platform + '.blocks'));
        });


    _this._.each(files, function (f) {

        function formDirnames(ending, folder) {
            dirnames = [];
            Object.keys(platforms).forEach(function(platform) {
                var pl = platforms[platform];

                dirnames.push(path.join(pl[pl.length - 1] + ending, folder));
            });
        }

        var dirnames = [];
        dirnames.push(path.dirname(f));

        if (_this.isBemjson && f === path.join('bundles', 'index', 'index.bemdecl.js')) return;

        if (!_this.isBemjson && f === path.join('bundles', 'index', 'index.bemjson.js')) return;

        (f === path.join('bundles', 'index', 'index.bemdecl.js') ||
            f === path.join('bundles', 'index', 'index.bemjson.js')) && formDirnames('.bundles', 'index');

        (f === path.join('blocks', '.bem', 'level.js')) && formDirnames('.blocks', '.bem');

        (f === path.join('bundles', '.bem', 'level.js')) && formDirnames('.bundles', '.bem');

        var src = path.join(root, f);   // copy from

        dirnames.map(function(dirname) {
            var dest = path.join(_this.destinationRoot(), _this.projectName, dirname, path.basename(f));  // where to copy
            _this.template(src, dest);
        });
    }.bind(_this));
};

// Adds dependencies in 'package.json'
BemGenerator.prototype.addPackages = function addPackages() {

    function getLibVersion(base, value) {
        return JSON.parse(_this.readFileAsString(configPath)).versions[base][value];
    }

    var _this = this,

        configPath = path.join(_this.sourceRoot(), 'config.json'), // path to 'config.json' in templates

        packagePath = path.join(_this.destinationRoot(), _this.projectName, 'package.json'),    // path to 'package.json' in the created project

        pack = JSON.parse(_this.readFileAsString(packagePath)),

        deps = _this.collectorName === 'bem-tools' ? pack.dependencies : pack.devDependencies,

        inJSON = _this.technologies.inJSON;

    inJSON.map(function(_package) {
        deps[_package] = getLibVersion('other', _package);
    });

    // autoprefixer
    _this.collectorName === 'bem-tools' &&
        this.roole && (deps['bem-tools-autoprefixer'] = getLibVersion('other', 'bem-tools-autoprefixer'));

    _this.collectorName === 'enb' &&
        _this.preprocessor && (deps['enb-autoprefixer'] = getLibVersion('other', 'enb-autoprefixer'));

    fs.writeFileSync(packagePath, JSON.stringify(pack, null, '  ') + '\n');
};

// --no-deps
BemGenerator.prototype.assemble = function assemble() {
    if (this.npmi) {
        this.log.write('').info(' ==> npm install...').write('');
        this.shell.exec('cd ' + this.projectName + ' && npm i');

        this.collectorName === 'enb' &&
            this.log.write('').info(' ==> bower install...').write('') &&
                this.shell.exec('cd ' + this.projectName + ' && ' + '.' + path.sep + path.join('node_modules', '.bin', 'bower') + ' i');
    }
}
