'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    fs = require('fs'),
    _ = require('lodash');

var BemgenGenerator = module.exports = function BemgenGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, path.join('..', 'package.json'))));
    this.username = this.user.git.email.split('@')[0] || this.shell.exec('whoami').output.trim();

    this.on('end', function () {
        this.log.write('').ok('Done!');
        setTimeout(process.exit, 0, 0);   // force exit
    });
};

util.inherits(BemgenGenerator, yeoman.generators.Base);

BemgenGenerator.prototype.askFor = function askFor() {
    var cb = this.async(),
        _this = this,
        configPath = path.join(_this.sourceRoot(), 'config.json'); // path to 'config.json' in templates

    function validateName(value) {
        return !value.match(/[^0-9a-zA-Z._-]/g);
    }

    function getLibVersion(base, value) {
        return JSON.parse(_this.readFileAsString(configPath)).versions[base][value];
    }

    // questions to user
    var prompts = [{
        type: 'input',
        name: 'projectName',
        message: 'How would you like to name the project?',
        validate: validateName,
        default: 'project-stub'
    }, {
        type: 'input',
        name: 'author',
        message: 'Who will mantain this project?',
        default: _this.user.git.username || 'Ivan Ivanovich'
    }, {
        type: 'input',
        name: 'email',
        message: 'Which email should we use?',
        default: _this.user.git.email || 'ivan@yandex-team.ru'
    }, {
        type: 'list',
        name: 'collector',
        message: 'What collector to use?',
        choices: [{
            value: 'bem-tools'
        }, {
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
        type: 'list',
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
        }]
    }, {
        type: 'confirm',
        name: 'design',
        message: 'Use design from bem-components?',
        default: true,
        when: function(input) {     // 'bem-core' --> 'bem-components' ==> 'design'
            var useComponents;

            input.addLibraries.map(function(lib) {
                lib.name === 'bem-components' && (useComponents = true);
            });

            return useComponents
        }
    }, {
        type: 'list',
        name: 'preprocessor',
        message: 'What preprocessor to use?',
        choices: function(input) {
            // returns the list of possible preprocessors in dependence of the previous answers
            var isEnb = input.collector === 'enb';
            var useComponents;

            input.addLibraries.map(function(lib) {
                lib.name === 'bem-components' && (useComponents = true);
            });

            if (isEnb && useComponents) {
                return [{
                        value: 'roole'
                    }, {
                        name: 'Only pure css',
                        value: 'roole'
                    }]
            }
            else if (!isEnb) {
                return [{
                        value: 'roole'
                    }, {
                        name: 'Only pure css',
                        value: 'css'
                    }]
            }
            else {
                return [{
                        value: 'stylus'
                    }, {
                        value: 'roole',
                    }, {
                        value: 'less',
                    }, {
                        name: 'Only pure css',
                        value: 'css'
                    }]
            }
        },
        when: function(input) {     // 'design' ==> 'roole'
            return !input.design;
        }
    }, {
        type: 'checkbox',
        name: 'techs',
        message: 'What technologies to use?',
        choices: function(input) {
            // returns the list of possible technologies to choose in dependence of the previous answers
            var collector = require('.' + path.sep + path.join('lib', input.collector === 'bem-tools' ? 'tools' : 'enb'));

            return collector.commonTech.concat(collector.templates.core, collector.scripts.coreWithoutLocal);
        }
    }, {
        type: 'list',
        name: 'templateSystem',
        message: 'What template system to use?',
        choices: [{
            name: 'bemhtml',
            value: 'bemhtml.js'
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
        message: 'Build static html?',
        default: true,
        when: function(input) { // 'bemjson' --> 'template system' ==> 'html'
            if (input.collector === 'bem-tools') return input.techs.indexOf('bemjson.js') > -1 && input.techs.indexOf('bemhtml') > -1;

            else return (input.templateSystem && (input.templateSystem !== 'my' || input.techs.indexOf('bemhtml.js') > -1) &&
                input.techs.indexOf('bemjson.js') > -1)
        }
    }, {
        type: 'checkbox',
        name: 'minimization',
        message: 'Which files do you want to minimize?',
        choices: function(input) {
            var toMinimize = [ { value: 'css' } ];

            input.techs.map(function(tech) {
                if (tech === 'browser.js') {
                    toMinimize.push( { value: 'js' } );
                    return;
                }

                tech !== 'bemjson.js' && toMinimize.push( { value: tech } );
            });

            (input.templateSystem && input.templateSystem !== 'my') && toMinimize.push( { value: 'bemhtml.js' } );

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
        _this.libs.unshift(props.baseLibrary);  // base lib on the top

        // ---------


        // Platforms
        // ---------

        // 'withPath' ==> 'bem-core/common.blocks' | 'withoutPath' ==> 'common'
        _this.platforms = {
            withPath :  collector.getPlatforms(props.platforms, _this.libs, props.design),
            withoutPath : props.platforms
        }

        // ---------


        // Minimization
        // ------------

        props.minimization && (_this.toMinify = props.minimization);

        // ------------


        // Technologies
        // ------------

        // 'ieN' ==> 'ie.css' | preprocessor
        props.techs = collector.addIe(collector.addPreprocessor(props.techs, props.preprocessor));

        // 'enb' --> 'bem-core' ==> 'bemhtml', 'bh'
        props.templateSystem && props.templateSystem !== 'my' && props.techs.push(props.templateSystem);

        props.html && props.techs.push('html');

        // if 'bem-tools', returns ==> 'technologies.inLevels' && 'technologies.inMake' | if 'enb', returns ==> 'technologies.inTechs' && 'technologies.inTargets'
        _this.technologies = collector.getTechnologies(configPath, props.techs, _this.toMinify);

        // 'enb' --> 'bemjson.js' ==> '{ target: '?.bemjson.js' }'
        _this.isBemjson = props.techs.indexOf('bemjson.js') > -1;
        _this.technologies.inTargets && (_this.target = _this.isBemjson ? 'bemjson.js' : 'bemdecl.js');

        // ------------


        // Source code
        // -----------

        _this.roole = (_this.collectorName === 'bem-tools' && (props.preprocessor === 'roole' || props.design)) ?
        {
            require: '\n\nrequire(\'bem-tools-autoprefixer\').extendMake(MAKE);', // requires 'autoprefixer' in make.js
            code: collector.getSourceCode(configPath, 'tools', 'roole') // source code for 'roole' in make.js
        } :
        {
            require: '',
            code: ''
        }

        var platforms = _this.platforms.withoutPath;

        // gets the source code for 'design'
        _this.design = props.design ? collector.getSourceCode(configPath, _this.collectorName === 'bem-tools' ? 'tools' : 'enb', 'design', platforms[platforms.length - 1]) : '';

        // -----------


        // enb ==> 'index.bemjson.js'
        // --------------------------

        _this.collectorName === 'enb' && (_this.scripts = collector.getScripts(_this.technologies.inTargets, _this.toMinify));

        // --------------------------

        cb();
    }

    //----------------------------------------------------------START--------------------------------------------------------------------//

    var params = {
        first: process.argv[3],
        second: process.argv[4]
    }

    if (_this.npmi = !(params.first === '--no-deps')) {
        // 'answersFromJSON !== undefined' when a valid path to JSON-file was given as a first parameter, for example, 'yo bemgen test.json'
        try {
            var answersFromJSON = params.first && JSON.parse(_this.readFileAsString(params.first));
        }
        catch(e) {
            this.log.error('Invalid path to JSON-file');
            process.exit(1);
        }

        _this.npmi = !(params.second === '--no-deps');
    }

    answersFromJSON ?
        getAnswers(answersFromJSON) :
        _this.prompt(prompts, function (props) { getAnswers(props); }.bind(_this));
};

BemgenGenerator.prototype.app = function app() {
    var platforms = this.platforms.withoutPath;
    var root = path.join(this.sourceRoot(), this.collectorName); // path to templates
    var files = this.expandFiles('**', { dot: true, cwd: root });   // roots of all files

    this._.each(files, function (f) {

        var dirname = path.dirname(f);

        if (this.collectorName === 'enb') {
            if (this.isBemjson && f === path.join('bundles', 'index', 'index.bemdecl.js')) return;

            if (!this.isBemjson && f === path.join('bundles', 'index', 'index.bemjson.js')) return;

            (f === path.join('bundles', 'index', 'index.bemdecl.js') || f === path.join('bundles', 'index', 'index.bemjson.js')) &&
                (dirname = path.join(platforms[platforms.length - 1] + '.bundles', 'index'));
        }
        else {
            (f === path.join('blocks', '.bem', 'level.js')) && (dirname = path.join(platforms[platforms.length - 1] + '.blocks', '.bem'));

            (f === path.join('bundles', '.bem', 'level.js')) && (dirname = path.join(platforms[platforms.length - 1] + '.bundles', '.bem'));

            (f === path.join('bundles', 'index', 'index.bemjson.js')) && (dirname = path.join(platforms[platforms.length - 1] + '.bundles', 'index'));
        }

        var src = path.join(root, f);   // copy from
        var dest = path.join(this.destinationRoot(), this.projectName, dirname, path.basename(f));  // where to copy
        this.template(src, dest);
    }.bind(this));
};

// Adds dependencies in 'package.json'
BemgenGenerator.prototype.addPackages = function addPackages() {
    var _this = this;

    function getLibVersion(base, value) {
        return JSON.parse(_this.readFileAsString(configPath)).versions[base][value];
    }

    var configPath = path.join(_this.sourceRoot(), 'config.json'), // path to 'config.json' in templates
        packagePath = path.join(_this.destinationRoot(), _this.projectName, 'package.json'),    // path to 'package.json' in the created project
        pack = JSON.parse(_this.readFileAsString(packagePath)),
        deps = this.collectorName === 'bem-tools' ? pack.dependencies : pack.devDependencies,
        inJSON = _this.technologies.inJSON;

    inJSON.map(function(_package) {
        deps[_package] = getLibVersion('other', _package);
    });

    this.collectorName === 'bem-tools' &&
        this.roole.require !== '' && (deps['bem-tools-autoprefixer'] = getLibVersion('other', 'bem-tools-autoprefixer'));

    this.collectorName === 'enb' &&
        this.design && (deps['enb-autoprefixer'] = getLibVersion('other', 'enb-autoprefixer')) &&
            (deps['enb-roole'] = getLibVersion('other', 'enb-roole'))

    fs.writeFileSync(packagePath, JSON.stringify(pack, null, '  ') + '\n');
};

// Makes the necessary empty folders in the created project
BemgenGenerator.prototype.createFolders = function createFolders() {
    var platforms = this.platforms.withoutPath;

    this.shell.exec('cd ' + this.projectName +
        ' && mkdir common.blocks ' + ((platforms[platforms.length - 2] !== 'common') ? platforms[platforms.length - 2] + ".blocks " : '') +
            ((this.collectorName === 'enb') ? platforms[platforms.length - 1] + ".blocks" : ''));
}

// --no-deps
BemgenGenerator.prototype.assemble = function assemble() {
    if (this.npmi) {
        this.log.write('').info(' ==> npm install...').write('');
        this.shell.exec('cd ' + this.projectName + ' && npm i');

        this.collectorName === 'enb' &&
            this.log.write('').info(' ==> bower install...').write('') &&
                this.shell.exec('cd ' + this.projectName + ' && ' + '.' + path.sep + path.join('node_modules', '.bin', 'bower') + ' i');
    }
}
