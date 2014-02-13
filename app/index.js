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

    function getLanguages(languages) {
        languages = languages.replace(/\s+/g, ' '); // removes duplicate spaces
        languages = languages.replace(/(^\s)|(\s$)/, '');   // removes the space at the beginning and at the end
        if (languages.indexOf('ru') === -1) languages = 'ru ' + languages;
        if (languages.indexOf('en') === -1) languages = 'en ' + languages;
        return languages;
    }

    // 'inBlocks' => '.bem/levels/blocks.js' | 'inMake' => '.bem/make.js'
    function getTechnologies(techs, html) {
        // gets the 'techs[value]' property from 'templates/config.json' 
        function getTech(value) { 
            var _tech = JSON.parse(fs.readFileSync(_path).toString()).techs[value];
            return (_tech !== undefined && _tech.indexOf('join(') !== -1) ? _tech : '\'' + _tech + '\''; 
        }

        // adds spaces in order to align techs in the source code
        function spaces() {
            var start = (arguments.length) ? arguments[0].length : techs[tech].length;
            var sp = '';
            for (var i = start + 2; i < 21; i++) {
                sp += ' ';
            }
            return sp;
        }

        var technologies = { 'inBlocks' : ['\'deps.js\'            : \'v2/deps.js\''], 'inMake' : ['deps.js'] }; // 'deps.js' is always included
        for (var tech in techs) {
            if (techs[tech] === 'browser.js') { // bem-core -> browser.js -> vanilla.js
                technologies.inBlocks.push('\'' + techs[tech] + '\'' + spaces() + ': ' + getTech(techs[tech]), '\'vanilla.js\'' + spaces('vanilla.js') + ': ' + getTech('vanilla.js')); 
                technologies.inMake.push(techs[tech], 'vanilla.js'); 
            }
            else if (techs[tech] === 'bemjson.js' && html) { 
                technologies.inBlocks.push('\'' + techs[tech] + '\'' + spaces() + ': ' + getTech(techs[tech]), '\'html\'' + spaces('html') + ': ' + getTech('html')); 
                technologies.inMake.push(techs[tech], 'html');
            }
            else { 
                technologies.inBlocks.push('\'' + techs[tech] + '\'' + spaces() + ': ' + getTech(techs[tech])); 
                technologies.inMake.push(techs[tech]);
            }
        } 
        return technologies;
    }

    // technologies
    var commonTech = [ { value: 'bemjson.js' }, { value: 'less' }, { value: 'roole' }, { value: 'css' }, { value: 'ie.css' }, { value: 'ie6.css' },
                        { value: 'ie7.css' }, { value: 'ie8.css' }, { value: 'ie9.css' } ],
        _commonTech = [ { value: 'priv.js' }, { value: 'bemhtml' }, { value: 'bemtree' }, { value: 'examples' } ],
        coreTech = [ { value: 'browser.js' }, { value: 'browser.js+bemhtml' }, { value: 'node.js' } ],
        blTech = [ { value: 'js' }, { value: 'js-i' }, { value: 'js+bemhtml' } ], 
        localizationTech = [ { value: 'i18n.js' }, { value: 'i18n.js+bemhtml' }, { value: 'i18n.html' } ];

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
            if (input.baseLibrary.name === 'bem-core' && !input.localization) return commonTech.concat(coreTech, _commonTech);
            else if (input.baseLibrary.name === 'bem-core' && input.localization) return commonTech.concat(coreTech, _commonTech, localizationTech);
            else if (input.baseLibrary.name === 'bem-bl' && !input.localization) return commonTech.concat(blTech, _commonTech);
            else if (input.baseLibrary.name === 'bem-bl' && input.localization) return commonTech.concat(_commonTech, localizationTech);
        }
    }, {
        type: 'confirm',
        name: 'html',
        message: 'Use html?',
        default: true,
        when: function(input) { // Has 'bemjson.js' been chosen without localization? Better to ask this question!
            return (input.techs.indexOf('bemjson.js') !== -1 && !input.localization) ? true : false;   
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

        this.technologies = getTechnologies(props.techs, props.html);
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
