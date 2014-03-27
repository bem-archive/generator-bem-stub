'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    fs = require('fs'),
    _ = require('lodash');

var BemgenGenerator = module.exports = function BemgenGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
    this.username = this.user.git.email.split('@')[0] || this.shell.exec('whoami').output.trim();

    this.on('end', function () {
        this.log.write('').ok('Done!');
        setTimeout(process.exit, 100, 0);   // force exit
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

    function validateLanguages(value) {
        return !(value === '');
    }

    function getLibVersion(base, value) {
        return JSON.parse(_this.readFileAsString(configPath)).versions[base][value];
    }

    function getLibRepo(value) {
        return JSON.parse(_this.readFileAsString(configPath)).repositories[value];
    }

    // questions to user
    var prompts = [{
        type: 'input',
        name: 'projectName',
        message: 'How would you like to name the project?',
        validate: validateName,
        default: path.basename(_this.dest._base)
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
        choices: [{
            name: 'bem-core',
            value: {
                name: 'bem-core',
                version: getLibVersion('core', 'bem-core'),
                repository: getLibRepo('bem-core')
            }
        }, {
            name: 'bem-bl',
            value: {
                name: 'bem-bl',
                version: getLibVersion('bl', 'bem-bl'),
                repository: getLibRepo('bem-bl')
            }
        }]
    }, {
        type: 'checkbox',
        name: 'addLibraries',
        message: 'Would you like any additional libraries?',
        choices: function (input) {
            // returns the list of possible additional libs in dependence of the base library
            var isCore = input.baseLibrary.name === 'bem-core',
                result = [];

            isCore && result.push({
                name: 'bem-components',
                value: {
                    name: 'bem-components',
                    version: getLibVersion('core', 'bem-components'),
                    repository: getLibRepo('bem-components')
                }
            });

            return result.concat({
                name: 'bem-mvc',
                value: {
                    name: 'bem-mvc',
                    version: getLibVersion(isCore ? 'core' : 'bl', 'bem-mvc'),
                    repository: getLibRepo('bem-mvc')
                }
            });
        }
    }, {
        type: 'list',
        name: 'platforms',
        message: 'What platform to use?',
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
        name: 'localization',
        message: 'Need localization?',
        default: true,
        when: function(input) {
            return input.collector === 'bem-tools' && input.baseLibrary.name === 'bem-bl';
        }
    }, {
        type: 'input',
        name: 'languages',
        message: 'Enter languages separated by a space (e.g. \'en\', \'ru\')',
        when: function(input) {
            return input.localization;   // Do we need localization?
        },
        validate: validateLanguages
    }, {
        type: 'list',
        name: 'preprocessor',
        message: 'What preprocessors to use?',
        choices: [{
            value: 'stylus'
        }, {
            value: 'roole',
        }, {
            value: 'less',
        }, {
            name: 'Only pure css',
            value: 'css'
        }]
    }, {
        type: 'checkbox',
        name: 'techs',
        message: 'What technologies to use?',
        choices: function(input) {
            var collector = require(input.collector === 'bem-tools' ? './lib/tools' : './lib/enb');

            var libName = input.baseLibrary.name;
            // returns the list of possible technologies to choose in dependence of the previous answers
            if (libName === 'bem-core') return collector.commonTech.concat(collector.templates.core, collector.scripts.coreWithoutLocal);
            if (libName === 'bem-bl') {
                if (input.collector === 'bem-tools' && input.localization) return collector.commonTech.concat(collector.templates.bl, collector.scripts.blWithLocal);

                return collector.commonTech.concat(collector.templates.bl, collector.scripts.blWithoutLocal);
            }
        }
    }, {
        type: 'list',
        name: 'templateSystem',
        message: 'What template system to use?',
        choices: [{
            value: 'bemhtml'
        }, {
            value: 'bh'
        }, {
            name: 'My template system',
            value: 'my'
        }],
        default: 3,
        when: function(input) { // 'enb' --> 'bem-core' --> 'bemjson.js' ==> template system
            return input.collector === 'enb' && input.baseLibrary.name === 'bem-core' && input.techs.indexOf('bemjson.js') > -1;
        }
    }, {
        type: 'confirm',
        name: 'html',
        message: 'Build static html?',
        default: true,
        when: function(input) { // Has 'bemjson.js' been chosen?
            return input.techs.indexOf('bemjson.js') > -1;
        }
    }];

    function getAnswers(props) {
        console.log(props);

        var collector = require((_this.collectorName = props.collector) === 'bem-tools' ? './lib/tools' : './lib/enb');

        // General information
        // -------------------

        _this.author = props.author;
        _this.email = props.email;
        _this.projectName = props.projectName;

        // -------------------


        // Libraries
        // ---------

        _this.libs = props.addLibraries;
        _this.libs.unshift(props.baseLibrary);

        // ---------


        // Platforms
        // ---------

        // 'withPath' ==> 'bem-core/common.blocks' | 'withoutPath' ==> 'common'
        _this.platforms = {
            withPath :  collector.getPlatforms(props.platforms, _this.libs),
            withoutPath : props.platforms
        }

        // ---------


        // Page
        // ----

        _this.collectorName === 'bem-tools' && (_this.page = props.baseLibrary.name === 'bem-core' ? 'page' : 'b-page');

        // ----


        // Localization
        // ------------

        _this.localizationCode = props.localization ? collector.getSourceCode(configPath, 'toolsLocalization') : '';
        _this.languages = props.localization ? collector.getLanguages(props.languages) : '';

        // localization ==> 'i18n' && 'i18n.js'
        props.localization && (props.techs = collector.addLocalTechs(props.techs, collector.scripts));

        // ------------


        // Technologies
        // ------------

        // 'ieN' ==> 'css' and 'ie.css' | preprocessors: 'stylus', 'roole', 'less', 'pure css'
        props.techs = collector.addCssIe(collector.addPreprocessor(props.techs, props.preprocessor));

        // 'enb' --> 'bem-core' ==> 'bemhtml', 'bh'
        props.templateSystem && props.templateSystem !== 'my' && props.techs.push(props.templateSystem);

        // 'localization' --> 'html' ==> 'i18n.html'
        props.html && props.techs.push(_this.collectorName === 'bem-tools' ? (props.localization ? 'i18n.html' : 'html') : 'html');

        // if 'bem-tools', returns ==> 'technologies.inLevels' && 'technologies.inMake' | if 'enb', returns ==> 'technologies.inTechs' && 'technologies.inTargets'
        _this.technologies = collector.getTechnologies(configPath, props.techs, props.baseLibrary.name);

        // 'enb' --> 'bemjson.js' ==> '{ target: '?.bemjson.js' }'
        _this.technologies.inTargets && (_this.target = _this.technologies.inTargets.indexOf('bemjson.js') > -1 ? 'bemjson.js' : 'bemdecl.js');

        // ------------

        cb();
    }

    //----------------------------------------------------------START--------------------------------------------------------------------//

    var params = {
        first: process.argv[3],
        second: process.argv[4]
    }

    if (_this.assemble = params.first === '+a') {}
    else {
        // 'answersFromJSON !== undefined' when a valid path to JSON-file was given as a first parameter, for example, 'yo bemgen test.json'
        try {
            var answersFromJSON = params.first && JSON.parse(_this.readFileAsString(params.first));
        }
        catch(e) {
            this.log.error('Invalid path to JSON-file');
            process.exit(1);
        }

        _this.assemble = params.second === '+a';
    }

    answersFromJSON ?
        getAnswers(answersFromJSON) :
        _this.prompt(prompts, function (props) { getAnswers(props); }.bind(_this));
};

BemgenGenerator.prototype.app = function app() {
    var root = path.join(this.sourceRoot(), this.collectorName); // path to templates
    var files = this.expandFiles('**', { dot: true, cwd: root });   // roots of all files
    this._.each(files, function (f) {
        var src = path.join(root, f);   // copy from
        var dest = path.join(this.destinationRoot(), this.projectName, path.dirname(f), path.basename(f));  // where to copy
        this.template(src, dest);
    }.bind(this));
};

// Have 'less' or 'roole' been chosen? ==> We need in additional installation of preprocessors
BemgenGenerator.prototype.addPreprocessor = function addPreprocessor() {
    var _this = this;

    function getLibVersion(base, value) {
        return JSON.parse(_this.readFileAsString(configPath)).versions[base][value];
    }

    var configPath = path.join(_this.sourceRoot(), 'config.json'), // path to 'config.json' in templates
        packagePath = path.join(_this.destinationRoot(), _this.projectName, 'package.json'),    // path to 'package.json' in the created project
        pack = JSON.parse(_this.readFileAsString(packagePath)),
        deps = pack.dependencies,
        techs = _this.collectorName === 'bem-tools' ? _this.technologies.inMake : _this.technologies.inTechs;

    // adds the necessary preprocessors to 'package.json' in the created project
    techs.indexOf('less') > -1 && (deps.less = getLibVersion('preprocessors', 'less'));
    techs.indexOf('roole') > -1 && (deps.roole = getLibVersion('preprocessors', 'roole'));
    techs.indexOf('stylus') > -1 && (deps.stylus = getLibVersion('preprocessors', 'stylus'));

    fs.writeFileSync(packagePath, JSON.stringify(pack, null, '  ') + '\n');
};

// +a
BemgenGenerator.prototype.assemble = function assemble() {
    if (this.assemble) {
        this.log.write('').info(' ==> npm install...').write('');
        this.shell.exec('cd ' + this.projectName + ' && npm i -s');
        this.log.write('').ok('Ok!').write('');

        this.log.write('').info(' ==> ./node_modules/.bin/bem make...').write('');
        this.shell.exec('cd ' + this.projectName + ' && ./node_modules/.bin/bem make');
    }
}