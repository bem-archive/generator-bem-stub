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
        { value: 'bemhtml' } ]
},
exports.scripts = {
    coreWithoutLocal: [
        { value: 'node.js' },
        { value: 'browser.js+bemhtml' }
    ],
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
        for (var platform in pls) {
            platforms.push(libs[lib].name + '/' + pls[platform] + '.blocks');
            design && libs[lib].name === 'bem-components' && platforms.push(libs[lib].name + '/design/' + pls[platform] + '.blocks');
        }
    }

    return platforms;
}

// handles selected technologies
exports.getTechnologies = function(configPath, techs) {
    function getTechDecl(tech) {
        // gets the 'techs[value]' property from 'templates/config.json'
        function getTechVal(tech) {
            var _tech = JSON.parse(fs.readFileSync(configPath).toString()).technologies.tools[tech].replace('BEM_TECHS', 'BEMCORE_TECHS');

            return _tech.indexOf('join(') > -1 ? _tech : '\'' + _tech + '\'';
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
            case 'i18n.html':  // 'bem-core' or 'bem-bl' with 'localization' and 'html' --> 'i18n.html' ==> 'html'
                inLevels.push(getTechDecl('i18n.html'), getTechDecl('html'));
                inMake.push('i18n.html');
                break;
            default:
                inLevels.push(getTechDecl(techs[tech]));
                inMake.push(techs[tech]);

                techs[tech] === 'roole' && inJSON.push(techs[tech]);
        }
    });

    technologies.inLevels = _.uniq(inLevels);

    return technologies;
}

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

exports.addIe = function(input) {
    var ie = /ie[0-9]{0,2}\.css/.exec(input);

    if (ie) {
        input.splice(input.indexOf(ie[0]), 0, 'ie.css');
        input = _.uniq(input);
    }

    return input;
}
