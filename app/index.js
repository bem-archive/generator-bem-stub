'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var BemgenGenerator = module.exports = function BemgenGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
    this.username = this.user.git.email.split('@')[0] || this.shell.exec('whoami').output.trim();

    this.on('end', function () {
        this.log.write('').ok('Done!');
        setTimeout(process.exit, 100, 0); // Force exit
    });
};

util.inherits(BemgenGenerator, yeoman.generators.Base);

BemgenGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    function checkName(value) { return !value.match(/[^0-9a-zA-Z._-]/g); }

    // Technologies
    var commonTech = [ { value: 'bemjson.js' }, { value: 'less' }, { value: 'roole' }, { value: 'css' }, { value: 'ie.css' }, { value: 'ieN.css' } ],
        _commonTech = [ { value: 'priv.js' }, { value: 'bemhtml' }, { value: 'bemtree' }, { value: 'examples' } ],
        coreTech = [ { value: 'browser.js' }, { value: 'browser.js+bemhtml' }, { value: 'node.js' } ],
        blTech = [ { value: 'js' }, { value: 'js-i' }, { value: 'js+bemhtml' } ], 
        localizationTech = [ { value: 'i18n.js' }, { value: 'i18n.js+bemhtml' }, { value: 'i18n.html' } ];

    var prompts = [{
        type: 'input',
        name: 'projectName',
        message: 'How would you like to name the project?',
        validate: checkName,
        default: path.basename(this.dest._base)
    }, {
        type: 'input',
        name: 'fullName',
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
        choices: [{ 
            value: 'bem' 
        }],
    }, {
        type: 'list',
        name: 'baseLibrary',
        message: 'What base library to use?',
        choices: [ { value: 'bem-core' }, { value: 'bem-bl' } ],
    }, {
        type: 'checkbox',
        name: 'addLibraries',
        message: 'Would you like any additional libraries?',
        choices: function (input) {
            if (input.baseLibrary === 'bem-core') return [ { value: 'bem-components' }, { value: 'bem-mvc' } ];
            else if (input.baseLibrary === 'bem-bl') return [ { value: 'bem-mvc' } ];
        }
    }, {
        type: 'list',
        name: 'platform',
        message: 'What platform to use?',
        choices: [ { value: 'desktop' }, { value: 'touch-pad' }, { value: 'touch-phone' } ],
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
            return input.localization ? true : false;
        }
    }, {
        type: 'checkbox',
        name: 'technology',
        message: 'What technologies to use?',
        choices: function(input) {
            if (input.baseLibrary === 'bem-core' && !input.localization) return commonTech.concat(coreTech, _commonTech);
            else if (input.baseLibrary === 'bem-core' && input.localization) return commonTech.concat(coreTech, _commonTech, localizationTech);
            else if (input.baseLibrary === 'bem-bl' && !input.localization) return commonTech.concat(blTech, _commonTech);
            else if (input.baseLibrary === 'bem-bl' && input.localization) return commonTech.concat(_commonTech, localizationTech);
        }
    }, {
        type: 'confirm',
        name: 'html',
        message: 'Use html?',
        default: true,
        when: function(input) {
            return (input.technology.indexOf('bemjson.js') !== -1 && !input.localization) ? true : false;
        }
    }];

    this.prompt(prompts, function (props) {
        this.someOption = props.someOption;
        
        cb();
    }.bind(this));
};

BemgenGenerator.prototype.app = function app() {
    this.mkdir('app');
    this.mkdir('app/templates');

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
};

BemgenGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
};
