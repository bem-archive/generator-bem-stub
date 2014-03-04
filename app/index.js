'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fs = require('fs');

// checks the entry of the value in the array
function inArray(arr, val) {
    for (var k in arr) {
        if (arr[k] === val) return true; 
    }
    return false;
} 

// removes all duplicate values in the array
function getUnique(arr) {
    var obj = {};
    for(var i = 0; i < arr.length; i++) {
        var str = arr[i];
        obj[str] = true;
    }
    return Object.keys(obj);
}

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

    // checks the validity of the project name
    function checkName(value) { return !value.match(/[^0-9a-zA-Z._-]/g); }

    // gets the version of the liblary from 'templates/config.json'
    function getVersion(base, value) { return JSON.parse(fs.readFileSync(_path).toString()).versions[base][value]; }

    // gets the piece of code from 'templates/config.json' which should be inserted in the source code
    function getSourceCode(value) { return JSON.parse(fs.readFileSync(_path).toString()).sourceCode[value]; }

    // receives, for example, pls['desktop', 'common'] and libs['bem-core'], returns platforms['bem-core/desktop.blocks', 'bem-core/common.blocks']
    function getPlatforms(pls, libs) {
        var platforms = [];
        for (var lib in libs) {
            for (var platform in pls) {
                platforms.push(libs[lib].name + '/' + ((libs[lib].name !== 'bem-bl') ?  pls[platform] + '.blocks' : 'blocks-' + pls[platform]));
            }
        }
        return platforms;
    }

    // handles typed languages
    function getLanguages(languages) {
        languages = languages.replace(/\s+/g, ' '); // removes duplicate spaces
        languages = languages.replace(/(^\s)|(\s$)/, '');   // removes space at the beginning and at the end
        
        // 'en' and 'ru' are default
        languages = 'en ru ' + languages;
        
        languages = languages.split(' ');
        if (languages[languages.length - 1] === '') languages.pop(); 
        
        return '\nprocess.env.BEM_I18N_LANGS = \'' + getUnique(languages).join(' ') + '\';';
    }

    // handles selected technologies
    function getTechnologies(techs, base) {
        // makes (formulates) a string of technology to push it into 'technologies.inLevels'
        function make(tech) {
            // gets the 'techs[value]' property from 'templates/config.json' 
            function getTechVal(tech) { 
                var _tech = JSON.parse(fs.readFileSync(_path).toString()).techs[tech];
                return (_tech.indexOf('join(') !== -1) ? _tech : '\'' + _tech + '\''; 
            }

            // adds spaces in order to align techs in the source code
            function spaces(start) {
                var sp = '';
                for (; start < 21; start++) {
                    sp += ' ';
                }
                return sp;
            }  

            // for example, returns ==> 'bemjson.js'         : join(PRJ_TECHS, 'bemjson.js')
            return '\'' + tech + '\'' + spaces(tech.length) + ': ' + getTechVal(tech);
        }

        // 'inLevels' ==> '.bem/levels/' | 'inMake' ==> '.bem/make.js'
        var technologies = { 'inLevels' : [ make('bemdecl.js'), make('deps.js')], 
                             'inMake' : [ 'bemdecl.js', 'deps.js'] };   // 'bemdecl.js' and 'deps.js' are always included

        for (var tech in techs) {
            switch (techs[tech]) {
                case 'bemjson.js':  // puts 'bemjson.js' on the top (it always goes the first in technologies)
                    technologies.inLevels.unshift(make('bemjson.js')); 
                    technologies.inMake.unshift('bemjson.js');
                    break;
                case 'browser.js+bemhtml':  // 'bem-core' --> 'browser.js+bemhtml' ==> 'vanilla.js', 'browser.js' and 'js'
                    technologies.inLevels.push(make('browser.js+bemhtml'), make('browser.js'), make('vanilla.js'), make('js')); 
                    technologies.inMake.push('browser.js+bemhtml');
                    break;
                case 'node.js': // 'bem-core' --> 'node.js' ==> 'vanilla.js' and 'js'
                    technologies.inLevels.push(make('node.js'), make('vanilla.js'), make('js')); 
                    technologies.inMake.push('node.js'); 
                    break;
                case 'i18n.html':  // 'bem-core' or 'bem-bl' with 'localization' and 'html' --> 'i18n.html' ==> 'html'
                    technologies.inLevels.push(make('i18n.html'), make('html')); 
                    technologies.inMake.push('i18n.html');
                    break;
                case 'i18n.js+bemhtml': // 'bem-bl' with 'localization' --> 'i18n.js+bemhtml' ==> 'i18n'
                    technologies.inLevels.push(make('i18n.js+bemhtml'), make('i18n')); 
                    technologies.inMake.push('i18n.js+bemhtml'); 
                    break;
                case 'i18n.js': // 'localization' --> 'i18n.js' ==> 'js'
                    technologies.inLevels.push(make('i18n.js'), make('js')); 
                    if (!inArray(techs, 'i18n.js+bemhtml')) technologies.inMake.push('i18n.js'); // 'i18n.js+bemhtml' (if has been chosen) instead of 'i18n.js' (in '.bem/make.js')
                    break;
                case 'js+bemhtml': // 'bem-bl' --> 'js+bemhtml' ==> 'js' and 'bemhtml'
                    technologies.inLevels.push(make('js+bemhtml'), make('js'), make('bemhtml')); 
                    technologies.inMake.push('js+bemhtml'); 
                    break;
                default:
                    technologies.inLevels.push(make(techs[tech])); 
                    technologies.inMake.push(techs[tech]);
                    break;
            }
        }

        technologies.inLevels = getUnique(technologies.inLevels);

        // for example, 'html'               : join(BEMCORE_TECHS, 'html.js') for bem-core; 'html'               : join(BEMBL_TECHS, 'html.js') for bem-bl;
        for (var tech in technologies.inLevels) {
            technologies.inLevels[tech] = (base === 'bem-core') ? technologies.inLevels[tech].replace('BEM_TECHS', 'BEMCORE_TECHS') : technologies.inLevels[tech].replace('BEM_TECHS', 'BEMBL_TECHS');
        }

        return technologies;
    }

    // technologies
    var commonTech = [ { value: 'bemjson.js' }, { value: 'css' }, { value: 'ie.css' }, { value: 'ie6.css' },
                    { value: 'ie7.css' }, { value: 'ie8.css' }, { value: 'ie9.css' }, { value: 'less' }, { value: 'roole' } ],
        templates = { core: [ { value: 'bemtree'  }, { value: 'bemhtml' } ], common: [ { value: 'bemhtml' } ] },
        scripts = { core: [ { value: 'node.js' }, { value: 'browser.js+bemhtml' } ], blWithLocal: [ { value: 'i18n.js+bemhtml' } ], blWithoutLocal: [ { value: 'js+bemhtml' } ] };

    var _path = this.sourceRoot() + '/config.json'; // path to 'config.json' in templates

    // questions to the user
    var prompts = [{
        type: 'input',
        name: 'projectName',
        message: 'How would you like to name the project?',
        validate: checkName,
        default: path.basename(this.dest._base)
    }, {
        type: 'input',
        name: 'author',
        message: 'Who will mantain this project?',
        default: this.user.git.username || 'Ivan Ivanovich'
    }, {
        type: 'input',
        name: 'email',
        message: 'Which email should we use?',
        default: this.user.git.email || 'ivan@yandex-team.ru'
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
            value: { name: 'bem-core', version: getVersion('core', 'bem-core') }
        }, {
            name: 'bem-bl', 
            value: { name: 'bem-bl', version: getVersion('bl', 'bem-bl') }
        }] 
    }, {
        type: 'checkbox',
        name: 'addLibraries',
        message: 'Would you like any additional libraries?',
        choices: function (input) {
            // returns the list of possible additional libs in dependence of the base library
            if (input.baseLibrary.name === 'bem-core') 
                return [{ 
                    name: 'bem-components', 
                    value: { name: 'bem-components', version: getVersion('core', 'bem-components') }
                }, {
                    name: 'bem-mvc', 
                    value: { name: 'bem-mvc', version: getVersion('core', 'bem-mvc') }
                }];
            else if (input.baseLibrary.name === 'bem-bl') 
                return [{
                    name: 'bem-mvc', 
                    value: { name: 'bem-mvc',  version: getVersion('bl', 'bem-mvc') }
                }];
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
        message: 'Need in localization?',
        default: true
    }, {
        type: 'input',
        name: 'languages',
        message: 'Enter languages separated by a space (\'en\', \'ru\' are default)',
        when: function(input) {
            return input.localization ? true : false;   // Do we need localization? ==> So, let's ask this question!
        }
    }, {
        type: 'checkbox',
        name: 'techs',
        message: 'What technologies to use?',
        choices: function(input) {
            // returns the list of possible technologies to choose in dependence of the previous answers
            if (input.baseLibrary.name === 'bem-core') return commonTech.concat(templates.core, scripts.core);
            else if (input.baseLibrary.name === 'bem-bl' && !input.localization) return commonTech.concat(templates.common, scripts.blWithoutLocal);
            else if (input.baseLibrary.name === 'bem-bl' && input.localization) return commonTech.concat(templates.common, scripts.blWithLocal);
        },
        filter: function(input) {
            var ie = false;
            for (var i = 0; i < input.length; i++) {
                if (input[i] === 'ie.css' || input[i] === 'ie6.css' || input[i] === 'ie7.css' || input[i] === 'ie8.css' || input[i] === 'ie9.css') {
                    ie = i;
                    break;
                }
            }

            if (ie !== false) input.splice(ie, 0, 'css', 'ie.css');
            input = getUnique(input);
            
            return input;
        }          
    }, {
        type: 'confirm',
        name: 'html',
        message: 'Use html?',
        default: true,
        when: function(input) { // Has 'bemjson.js' been chosen? ==> Better to ask this question!
            return (input.techs.indexOf('bemjson.js') !== -1) ? true : false;   
        }                                                                                                   
    }];

    function getAnswers(_this, props) {
        console.log(props);
        // adds 'i18n' and 'i18n.js'
        function addLocalTechs(input) {
            var count = 0;
            for (var i in scripts) {
                for (var j = 0; j < scripts[i].length; j++) {
                    if (inArray(input, scripts[i][j].value)) count++;
                }
            }
            input.splice(input.length - count, 0, 'i18n', 'i18n.js');
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

        _this.page = (props.baseLibrary.name === 'bem-core') ? 'page' : 'b-page';
        /* desktop.bundles/index/index.bemjson.js -->
                <%= page %>
        */

        // 'withPath' ==> 'bem-core/common.blocks' | 'withoutPath' ==> 'common'
        _this.platforms = { 'withPath' :  getPlatforms(props.platforms, _this.libs), 'withoutPath' : props.platforms }
        /* desktop.bundles/.bem/level.js -->    
                <%= _.map(platforms.withPath, function(platform) { return "                '" + platform + "'"}).join(',\n') %>
                <%= _.map(platforms.withoutPath, function(platform) { return "                '" + platform + ".blocks'"}).join(',\n') %>
        */

        _this.localizationCode = (props.localization) ? getSourceCode('localization') : '';
        _this.languages = (props.localization) ? getLanguages(props.languages) : '';
        /*
            .bem/make.js -->
                <%= languages %> | <%= localizationCode %>
        */

        if (props.localization) props.techs = addLocalTechs(props.techs);   // localization has been chosen --> let's add 'i18n' and 'i18n.js' to techs
        if (props.html && props.localization) props.techs.push('i18n.html'); else if (props.html && !props.localization) props.techs.push('html');
        _this.technologies = getTechnologies(props.techs, props.baseLibrary.name);
        /*
            .bem/make.js -->
                <%= _.map(technologies.inMake, function(technology) { return "            '" + technology + "'"}).join(',\n') %>
            .bem/levels/blocks.js -->
                <%= _.map(technologies.inLevels, function(technology) { return "        " + technology}).join(',\n') %>
        */

        cb();
    }

    // 'answersFromJSON !== undefined' when the valid path to JSON-file was given as a parameter, for example, 'yo bemgen pathTo/test.json'
    try {
        var answersFromJSON = JSON.parse(fs.readFileSync(process.argv.slice(3).shift()).toString());
    }
    catch(e) {
        this.answersFromJSON = undefined;
    }

    (answersFromJSON) ? /* answers from the JSON file */ getAnswers(this, answersFromJSON) : /* answers from the user */ this.prompt(prompts, function (props) { getAnswers(this, props); }.bind(this));
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
    // gets the version of the preprocessor from 'templates/config.json'
    function getVersion(base, value) { return JSON.parse(fs.readFileSync(_path).toString()).versions[base][value]; }

    var _path = this.sourceRoot() + '/config.json', // path to 'config.json' in templates
        packagePath = this.destinationRoot() + '/' + this.projectName + '/package.json',    // path to 'package.json' in the created project
        pack = JSON.parse(fs.readFileSync(packagePath).toString());

    // adds the necessary preprocessors to 'package.json' in the created project
    if (inArray(this.technologies.inMake, 'less') && inArray(this.technologies.inMake, 'roole')) {
        pack.dependencies.less = getVersion('preprocessors', 'less');
        pack.dependencies.roole = getVersion('preprocessors', 'roole');
    }
    else if (inArray(this.technologies.inMake, 'less')) {
        pack.dependencies.less = getVersion('preprocessors', 'less');
    }
    else if (inArray(this.technologies.inMake, 'roole')) {
        pack.dependencies.roole = getVersion('preprocessors', 'roole');
    }

    fs.writeFileSync(packagePath, JSON.stringify(pack, null, '  ') + '\n');  
};
