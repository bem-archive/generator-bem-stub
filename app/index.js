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
    var cb = this.async();
    var _this = this;

    function validateName(value) {
        return !value.match(/[^0-9a-zA-Z._-]/g);
    }

    function validateLanguages(value) {
        return !value === '';
    }

    function getLibVersion(base, value) {
        return JSON.parse(_this.readFileAsString(configPath)).versions[base][value];
    }

    // gets the piece of code from 'templates/config.json' which should be inserted in the source code
    function getSourceCode(value) {
        return JSON.parse(_this.readFileAsString(configPath)).sourceCode[value];
    }

    // receives, for example, pls['desktop', 'common'] and libs['bem-core'], returns platforms['bem-core/desktop.blocks', 'bem-core/common.blocks']
    function getPlatforms(pls, libs) {
        var platforms = [];
        for (var lib in libs) {
            for (var platform in pls) {
                platforms.push(libs[lib].name + '/' + (libs[lib].name !== 'bem-bl' ?  pls[platform] + '.blocks' : 'blocks-' + pls[platform]));
            }
        }

        return platforms;
    }

    // handles typed languages
    function getLanguages(languages) {
        return '\nprocess.env.BEM_I18N_LANGS = \'' + _.uniq(languages.replace(/\s+/g, ' ').trim().split(' ')).join(' ') + '\';';
    }

    // handles selected technologies
    function getTechnologies(techs, base) {
        function getTechDecl(tech) {
            // gets the 'techs[value]' property from 'templates/config.json'
            function getTechVal(tech) {
                var _tech = JSON.parse(_this.readFileAsString(configPath)).techs[tech].replace('BEM_TECHS', base === 'bem-core' ? 'BEMCORE_TECHS'  : 'BEMBL_TECHS');

                return _tech.indexOf('join(') !== -1 ? _tech : '\'' + _tech + '\'';
            }

            // for example, returns ==> 'bemjson.js'         : join(PRJ_TECHS, 'bemjson.js')
            return '\'' + tech + '\'' + new Array(22 - tech.length).join(' ') + ': ' + getTechVal(tech);
        }

        // 'inLevels' ==> '.bem/levels/' | 'inMake' ==> '.bem/make.js'
        var technologies = {
                // 'bemdecl.js' and 'deps.js' are always included
                inLevels : [ getTechDecl('bemdecl.js'), getTechDecl('deps.js')],
                inMake : [ 'bemdecl.js', 'deps.js']
            },
            inLevels = technologies.inLevels,
            inMake = technologies.inMake;

        Object.keys(techs).forEach(function(tech) {
            switch (techs[tech]) {
                case 'bemjson.js':  // puts 'bemjson.js' on the top (it always goes the first in technologies)
                    inLevels.unshift(getTechDecl('bemjson.js'));
                    inMake.unshift('bemjson.js');
                    break;
                case 'browser.js+bemhtml':  // 'bem-core' --> 'browser.js+bemhtml' ==> 'vanilla.js', 'browser.js' and 'js'
                    inLevels.push(getTechDecl('browser.js+bemhtml'), getTechDecl('browser.js'), getTechDecl('vanilla.js'), getTechDecl('js'));
                    inMake.push('browser.js+bemhtml');
                    break;
                case 'node.js': // 'bem-core' --> 'node.js' ==> 'vanilla.js' and 'js'
                    inLevels.push(getTechDecl('node.js'), getTechDecl('vanilla.js'), getTechDecl('js'));
                    inMake.push('node.js');
                    break;
                case 'i18n.html':  // 'bem-core' or 'bem-bl' with 'localization' and 'html' --> 'i18n.html' ==> 'html'
                    inLevels.push(getTechDecl('i18n.html'), getTechDecl('html'));
                    inMake.push('i18n.html');
                    break;
                case 'i18n.js+bemhtml': // 'bem-bl' with 'localization' --> 'i18n.js+bemhtml' ==> 'i18n'
                    inLevels.push(getTechDecl('i18n.js+bemhtml'), getTechDecl('i18n'));
                    inMake.push('i18n.js+bemhtml');
                    break;
                case 'i18n.js': // 'localization' --> 'i18n.js' ==> 'js'
                    inLevels.push(getTechDecl('i18n.js'), getTechDecl('js'));
                    if (techs.indexOf('i18n.js+bemhtml') < 0) inMake.push('i18n.js'); // 'i18n.js+bemhtml' (if has been chosen) instead of 'i18n.js' (in '.bem/make.js')
                    break;
                case 'js+bemhtml': // 'bem-bl' --> 'js+bemhtml' ==> 'js' and 'bemhtml'
                    inLevels.push(getTechDecl('js+bemhtml'), getTechDecl('js'), getTechDecl('bemhtml'));
                    inMake.push('js+bemhtml');
                    break;
                default:
                    inLevels.push(getTechDecl(techs[tech]));
                    inMake.push(techs[tech]);
            }
        });

        technologies.inLevels = _.uniq(inLevels);

        return technologies;
    }

    // technologies
    var commonTech = [
            { value: 'bemjson.js' },
            { value: 'css' },
            { value: 'ie.css' },
            { value: 'ie6.css' },
            { value: 'ie7.css' },
            { value: 'ie8.css' },
            { value: 'ie9.css' },
            { value: 'less' },
            { value: 'roole' }
        ],
        templates = {
            core: [
                { value: 'bemtree'  },
                { value: 'bemhtml' } ],
            common: [
                { value: 'bemhtml' }
            ]
        },
        scripts = {
            core: [
                { value: 'node.js' },
                { value: 'browser.js+bemhtml' }
            ],
            blWithLocal: [
                { value: 'i18n.js+bemhtml' }
            ],
            blWithoutLocal: [
                { value: 'js+bemhtml' }
            ]
        };

    var configPath = path.join(_this.sourceRoot(), 'config.json'); // path to 'config.json' in templates

    // questions to the user
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
        choices: [ { value: 'bem' } ]
    }, {
        type: 'list',
        name: 'baseLibrary',
        message: 'What base library to use?',
        choices: [{
            name: 'bem-core',
            value: { name: 'bem-core', version: getLibVersion('core', 'bem-core') }
        }, {
            name: 'bem-bl',
            value: { name: 'bem-bl', version: getLibVersion('bl', 'bem-bl') }
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
                value: { name: 'bem-components', version: getLibVersion('core', 'bem-components') }
            });

            return result.concat({
                name: 'bem-mvc',
                value: { name: 'bem-mvc',  version: getLibVersion(isCore ? 'core' : 'bl', 'bem-mvc') }
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
        default: true
    }, {
        type: 'input',
        name: 'languages',
        message: 'Enter languages separated by a space (e.g. \'en\', \'ru\')',
        when: function(input) {
            return input.localization;   // Do we need localization?
        },
        validate: validateLanguages
    }, {
        type: 'checkbox',
        name: 'techs',
        message: 'What technologies to use?',
        choices: function(input) {
            var libName = input.baseLibrary.name;
            // returns the list of possible technologies to choose in dependence of the previous answers
            if (libName === 'bem-core') return commonTech.concat(templates.core, scripts.core);
            if (libName === 'bem-bl') {
                if (input.localization) return commonTech.concat(templates.common, scripts.blWithLocal);

                return commonTech.concat(templates.common, scripts.blWithoutLocal);
            }
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
        // adds 'i18n' and 'i18n.js'
        function addLocalTechs(input) {
            for (var i in scripts) {
                for (var j = 0; j < scripts[i].length; j++) {
                    var pos = input.indexOf(scripts[i][j].value)
                    if (pos > -1) {
                        input.splice(pos, 0, 'i18n', 'i18n.js');

                        return input;
                    }
                }
            }

            input.push('i18n', 'i18n.js');

            return input;
        }

        function addCssIe(input) {
            var ie = /ie[0-9]{0,2}\.css/.exec(input);

            if (ie) {
                input.splice(input.indexOf(ie[0]), 0, 'css', 'ie.css');
                input = _.uniq(input);
            }

            return input;
        }

        _this.author = props.author;
        _this.email = props.email;
        _this.projectName = props.projectName;
        /* package.json -->
                <%= author %> | <%= email %> | <%= projectName %>
        */

        _this.collector = props.collector;
        /*

        */

        _this.libs = props.addLibraries;
        _this.libs.unshift(props.baseLibrary);
        /* .bem/make.js -->
                <%= _.map(libs, function(lib) { return "        '" + lib.name + " @ " + lib.version + "'"}).join(',\n') %>
        */

        _this.page = props.baseLibrary.name === 'bem-core' ? 'page' : 'b-page';
        /* desktop.bundles/index/index.bemjson.js -->
                <%= page %>
        */

        // 'withPath' ==> 'bem-core/common.blocks' | 'withoutPath' ==> 'common'
        _this.platforms = {
            withPath :  getPlatforms(props.platforms, _this.libs),
            withoutPath : props.platforms
        }
        /* desktop.bundles/.bem/level.js -->
                <%= _.map(platforms.withPath, function(platform) { return "                '" + platform + "'"}).join(',\n') %>
                <%= _.map(platforms.withoutPath, function(platform) { return "                '" + platform + ".blocks'"}).join(',\n') %>
        */

        _this.localizationCode = props.localization ? getSourceCode('localization') : '';
        _this.languages = props.localization ? getLanguages(props.languages) : '';
        /*
            .bem/make.js -->
                <%= languages %> | <%= localizationCode %>
        */

        props.techs = addCssIe(props.techs);    // 'ieN' ==> 'css' and 'ie.css'
        props.localization && (props.techs = addLocalTechs(props.techs));   // localization has been chosen --> let's add 'i18n' and 'i18n.js' to techs
        props.html && props.techs.push(props.localization ? 'i18n.html' : 'html');

        _this.technologies = getTechnologies(props.techs, props.baseLibrary.name);
        /*
            .bem/make.js -->
                <%= _.map(technologies.inMake, function(technology) { return "            '" + technology + "'"}).join(',\n') %>
            .bem/levels/blocks.js -->
                <%= _.map(technologies.inLevels, function(technology) { return "        " + technology}).join(',\n') %>
        */

        cb();
    }

    //----------------------------------------------------------START--------------------------------------------------------------------//

    // 'answersFromJSON !== undefined' when the valid path to JSON-file was given as a parameter, for example, 'yo bemgen pathTo/test.json'
    try {
        var answersFromJSON = JSON.parse(_this.readFileAsString(process.argv[3]));
    }
    catch(e) {}

    answersFromJSON ?
        getAnswers(answersFromJSON) :
        _this.prompt(prompts, function (props) { getAnswers(props); }.bind(_this));
};

BemgenGenerator.prototype.app = function app() {
    var root = this.sourceRoot() + '/project-stub'; // path to 'project-stub' in templates
    var files = this.expandFiles('**', { dot: true, cwd: root });   // roots of all files in 'project-stub'
    this._.each(files, function (f) {
        var src = path.join(root, f);   // copy from
        var dest = path.join(this.destinationRoot(), this.projectName, path.dirname(f), path.basename(f));  // where to copy
        this.template(src, dest);
    }.bind(this));
};

// Have 'less' or 'roole' been chosen? ==> We need in additional installation of preprocessores
BemgenGenerator.prototype.installPreprocessors = function installPreprocessors() {
    var _this = this;

    function getLibVersion(base, value) {
        return JSON.parse(_this.readFileAsString(configPath)).versions[base][value];
    }

    var configPath = path.join(_this.sourceRoot(), 'config.json'), // path to 'config.json' in templates
        packagePath = path.join(_this.destinationRoot(), _this.projectName, 'package.json'),    // path to 'package.json' in the created project
        pack = JSON.parse(_this.readFileAsString(packagePath)),
        deps = pack.dependencies,
        inMake = _this.technologies.inMake;

    // adds the necessary preprocessors to 'package.json' in the created project
    inMake.indexOf('less') > -1 && (deps.less = getLibVersion('preprocessors', 'less'));
    inMake.indexOf('roole') > -1 && (deps.roole = getLibVersion('preprocessors', 'roole'));

    fs.writeFileSync(packagePath, JSON.stringify(pack, null, '  ') + '\n');
};