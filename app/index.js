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

    function checkName(value) { return !value.match(/[^0-9a-zA-Z._-]/g); }
    function getVersion(value) { return JSON.parse(fs.readFileSync(_path).toString()).versions[value]; }

    // technologies
    var commonTech = [ { value: 'bemjson.js' }, { value: 'less' }, { value: 'roole' }, { value: 'css' }, { value: 'ie.css' }, { value: 'ieN.css' } ],
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
            value: ['desktop', 'common'] 
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
        message: 'Enter languages separated by a space ("ru", "en" are default)',
        when: function(input) {
            return input.localization ? true : false;   // We need localization? So, let's ask this question!
        }
    }, {
        type: 'checkbox',
        name: 'technology',
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
        when: function(input) {
            return (input.technology.indexOf('bemjson.js') !== -1 && !input.localization) ? true : false;   // 'bemjson.js' has been chosen without localization?
        }                                                                                                   // Better to ask this question!
    }];

     // answers from the user
    this.prompt(prompts, function (props) { 
        this.author = props.author;
        this.email = props.email;
        this.projectName = props.projectName;

        this.libs = props.addLibraries;
        this.libs.unshift(props.baseLibrary);

        this.platforms = [];

        for (var lib in this.libs) {
            for (var platform in props.platforms) {
                this.platforms.push(this.libs[lib].name + '/' + ((this.libs[lib].name !== 'bem-bl') ?  props.platforms[platform] + '.blocks' : 'blocks-' + props.platforms[platform]));
            }
        }

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

BemgenGenerator.prototype.projectfiles = function projectfiles() {

};
