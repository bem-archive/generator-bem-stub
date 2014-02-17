'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fs = require('fs');


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
    function getVersion(value) { return JSON.parse(fs.readFileSync(_path).toString()).versions[value]; }

    // removes all duplicate values in array
    function getUnique(arr) {
        var obj = {};
        for(var i = 0; i < arr.length; i++) {
            var str = arr[i];
            obj[str] = true;
        }
        return Object.keys(obj);
    }

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

    // handles the typed languages
    function getLanguages(languages) {
        languages = languages.replace(/\s+/g, ' '); // removes duplicate spaces
        languages = languages.replace(/(^\s)|(\s$)/, '');   // removes the space at the beginning and at the end
        
        // 'ru' and 'en' are default
        languages = 'ru en ' + languages;
        
        languages = languages.split(' ');
        if (languages[languages.length - 1] === '') languages.pop(); 
        
        return getUnique(languages);
    }

    // handles the selected technologies
    function getTechnologies(techs) {
        // makes a string of technology to push it into 'technologies.inLevels'
        function make(tech) {
            // gets the 'techs[value]' property from 'templates/config.json' 
            function getTechVal(tech) { 
                var _tech = JSON.parse(fs.readFileSync(_path).toString()).techs[tech];
                return (_tech !== undefined && _tech.indexOf('join(') !== -1) ? _tech : '\'' + _tech + '\''; 
            }

            // adds spaces in order to align techs in the source code
            function spaces(start) {
                //var start = tech.length;
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
                    technologies.inLevels.push(make('browser.js+bemhtml'), make('vanilla.js'), make('browser.js'), make('js')); 
                    technologies.inMake.push('browser.js+bemhtml');
                    break;
                case 'node.js': // 'bem-core' --> 'node.js' ==> 'vanilla.js' and 'js'
                    technologies.inLevels.push(make('node.js'), make('vanilla.js'), make('js')); 
                    technologies.inMake.push('node.js'); 
                    break;
                default:
                    technologies.inLevels.push(make(techs[tech])); 
                    technologies.inMake.push(techs[tech]);
                    break;
            }
        }

        technologies.inLevels = getUnique(technologies.inLevels);

        return technologies;
    }

    // technologies
    var commonTech = [ { value: 'bemjson.js' }, { value: 'css' }, { value: 'ie.css' }, { value: 'ie6.css' },
                    { value: 'ie7.css' }, { value: 'ie8.css' }, { value: 'ie9.css' }, { value: 'less' }, { value: 'roole' } ],
        templates = { core: [ { value: 'bemtree'  }, { value: 'bemhtml' } ], common: [ { value: 'bemhtml' } ] },
        localizationTech = [ { value: 'i18n.js' } ],
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
            value: { name: 'bem-core', version: getVersion('bem-core') }
        }, {
            name: 'bem-bl', 
            value: { name: 'bem-bl', version: getVersion('bem-bl') }
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
                    value: { name: 'bem-components', version: getVersion('bem-components') }
                }, {
                    name: 'bem-mvc', 
                    value: { name: 'bem-mvc', version: getVersion('bem-mvc') }
                }];
            else if (input.baseLibrary.name === 'bem-bl') 
                return [{
                    name: 'bem-mvc', 
                    value: { name: 'bem-mvc',  version: getVersion('bem-mvc') }
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
        message: 'Enter languages separated by a space (\'ru\', \'en\' are default)',
        when: function(input) {
            return input.localization ? true : false;   // Do we need localization? So, let's ask this question!
        }
    }, {
        type: 'checkbox',
        name: 'techs',
        message: 'What technologies to use?',
        choices: function(input) {
            // returns the list of possible technologies to choose in dependence of the previous answers
            if (input.baseLibrary.name === 'bem-core' && !input.localization) return commonTech.concat(templates.core, scripts.core);
            else if (input.baseLibrary.name === 'bem-core' && input.localization) return commonTech.concat(templates.core, localizationTech, scripts.core);
            else if (input.baseLibrary.name === 'bem-bl' && !input.localization) return commonTech.concat(templates.common, scripts.blWithoutLocal);
            else if (input.baseLibrary.name === 'bem-bl' && input.localization) return commonTech.concat(templates.common, localizationTech, scripts.blWithLocal);
        }
    }, {
        type: 'confirm',
        name: 'html',
        message: 'Use html?',
        default: true,
        when: function(input) { // Has 'bemjson.js' been chosen without localization? Better to ask this question!
            return (input.techs.indexOf('bemjson.js') !== -1) ? true : false;   
        }                                                                                                   
    }];

    // answers from the user
    this.prompt(prompts, function (props) { 
        this.author = props.author;
        this.email = props.email;
        this.projectName = props.projectName;
        /* package.json --> 
                <%= author %> | <%= email %> | <%= projectName %>
        */

        this.collector = props.collector;
        /*

        */

        this.libs = props.addLibraries;
        this.libs.unshift(props.baseLibrary);
        /* .bem/make.js -->
                <%= _.map(libs, function(lib) { return "        '" + lib.name + " @ " + lib.version + "'"}).join(',\n') %>
        */
        
        // 'withPath' ==> 'bem-core/common.blocks' | 'withoutPath' ==> 'common'
        this.platforms = { 'withPath' :  getPlatforms(props.platforms, this.libs), 'withoutPath' : props.platforms }
        /* desktop.bundles/.bem/level.js -->    
                <%= _.map(platforms.withPath, function(platform) { return "                '" + platform + "'"}).join(',\n') %>
                <%= _.map(platforms.withoutPath, function(platform) { return "                '" + platform + ".blocks'"}).join(',\n') %>
        */

        this.languages = (props.localization) ? getLanguages(props.languages) : [];
        /*

        */

        if (props.html && props.localization) props.techs.push('i18n.html'); else if (props.html && !props.localization) props.techs.push('html');
        this.technologies = getTechnologies(props.techs);
        /*
            .bem/make.js -->
                <%= _.map(technologies.inMake, function(technology) { return "            '" + technology + "'"}).join(',\n') %>
            .bem/levels/blocks.js -->
                <%= _.map(technologies.inBlocks, function(technology) { return "        " + technology}).join(',\n') %>
        */

        cb();
    }.bind(this));
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
