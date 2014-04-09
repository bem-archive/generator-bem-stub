'use strict';
var fs = require('fs'),
    _ = require('lodash'),
    path = require('path');

// technologies
exports.commonTech = [
    { value: 'bemjson.js' },
    { value: 'ie.css' },
    { value: 'ie6.css' },
    { value: 'ie7.css' },
    { value: 'ie8.css' },
    { value: 'ie9.css' }
],
exports.templates = {
    core: [
        { value: 'bemtree'  },
        { value: 'bemhtml' } ],
    bl: [
        { value: 'bemhtml' }
    ]
},
exports.scripts = {
    coreWithoutLocal: [
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

// gets the piece of code from 'templates/config.json' which should be inserted in the source code
exports.getSourceCode = function(configPath, collector) {
    var res = '';

    for (var value = 2; value < arguments.length; value++)
        res += JSON.parse(fs.readFileSync(configPath).toString()).sourceCode[collector][arguments[value]];

    return res;
}

// receives, for example, pls['desktop', 'common'] and libs['bem-core'], returns platforms['bem-core/desktop.blocks', 'bem-core/common.blocks']
exports.getPlatforms = function(pls, libs, design) {
    var platforms = [];
    for (var lib in libs) {
        for (var platform in pls) {     // 'bem-bl' ==> 'blocks-common', 'blocks-desktop', 'blocks-touch' ...
            platforms.push(libs[lib].name + '/' + (libs[lib].name !== 'bem-bl' ?  pls[platform] + '.blocks' : 'blocks-' + pls[platform]));
            design && libs[lib].name === 'bem-components' && platforms.push(libs[lib].name + '/design/' + pls[platform] + '.blocks');
        }
    }

    return platforms;
}

// handles typed languages
exports.getLanguages = function(languages) {
    return '\nprocess.env.BEM_I18N_LANGS = \'' + _.uniq(languages.replace(/\s+/g, ' ').trim().split(' ')).join(' ') + '\';';
}

// handles selected technologies
exports.getTechnologies = function(configPath, techs, base) {
    function getTechDecl(tech) {
        // gets the 'techs[value]' property from 'templates/config.json'
        function getTechVal(tech) {
            var _tech = JSON.parse(fs.readFileSync(configPath).toString()).technologies.tools[tech].replace('BEM_TECHS', base === 'bem-core' ? 'BEMCORE_TECHS'  : 'BEMBL_TECHS');

            return _tech.indexOf('join(') !== -1 ? _tech : '\'' + _tech + '\'';
        }

        // for example, returns ==> 'bemjson.js'         : join(PRJ_TECHS, 'bemjson.js')
        return '\'' + tech + '\'' + new Array(22 - tech.length).join(' ') + ': ' + getTechVal(tech);
    }

    // 'inLevels' ==> '.bem/levels/' | 'inMake' ==> '.bem/make.js'
    var technologies = {
            // 'bemdecl.js' and 'deps.js' are always included
            inLevels : [ getTechDecl('bemdecl.js'), getTechDecl('deps.js')],
            inMake : [ 'bemdecl.js', 'deps.js'],
            inJSON : []
        },
        inLevels = technologies.inLevels,
        inMake = technologies.inMake,
        inJSON = technologies.inJSON;

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
            case 'i18n.html':  // 'bem-bl' --> 'localization' --> 'html' ==> 'i18n.html', 'html'
                inLevels.push(getTechDecl('i18n.html'), getTechDecl('html'));
                inMake.push('i18n.html');
                break;
            case 'i18n.js+bemhtml': // 'bem-bl' --> 'localization' --> 'i18n.js+bemhtml' ==> 'i18n'
                inLevels.push(getTechDecl('i18n.js+bemhtml'), getTechDecl('i18n'));
                inMake.push('i18n.js+bemhtml');
                break;
            case 'i18n.js': // 'bem-bl' --> 'localization' --> 'i18n.js' ==> 'js'
                inLevels.push(getTechDecl('i18n.js'), getTechDecl('js'));
                if (techs.indexOf('i18n.js+bemhtml') < 0) inMake.push('i18n.js'); // 'i18n.js+bemhtml' (if has been chosen) instead of 'i18n.js' (in '.bem/make.js')
                break;
            case 'js+bemhtml': // 'bem-bl' --> 'js+bemhtml' ==> 'js', 'bemhtml'
                inLevels.push(getTechDecl('js+bemhtml'), getTechDecl('js'), getTechDecl('bemhtml'));
                inMake.push('js+bemhtml');
                break;
            default:
                inLevels.push(getTechDecl(techs[tech]));
                inMake.push(techs[tech]);

                (techs[tech] === 'stylus' || techs[tech] === 'roole' || techs[tech] === 'less') && inJSON.push(techs[tech]);
        }
    });

    technologies.inLevels = _.uniq(inLevels);

    return technologies;
}

// adds 'i18n' and 'i18n.js'
exports.addLocalTechs = function(input, scripts) {
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

// preprocessors: 'stylus', 'roole', 'less', 'pure css'
exports.addPreprocessor = function(input, preprocessor) {

    if (preprocessor === 'css') {
        input.splice(input.indexOf('bemjson.js') + 1, 0, 'css');

        return input;
    }
    else if (preprocessor === 'roole' || !preprocessor) {
        input.splice(input.indexOf('bemjson.js') + 1, 0, 'roole', 'css');

        return input;
    }

    input.splice(input.indexOf('bemjson.js') + 1, 0, preprocessor);

    return input;
}

// 'ieN' ==> ie.css'
exports.addIe = function(input) {
    var ie = /ie[0-9]{0,2}\.css/.exec(input);

    if (ie) {
        input.splice(input.indexOf(ie[0]), 0, 'ie.css');
        input = _.uniq(input);
    }

    return input;
}
