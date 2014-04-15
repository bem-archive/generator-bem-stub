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

    libs.map(function(lib) {
        pls.map(function(platform) {
            platforms.push(lib.name + '/' + platform + '.blocks');

            design && lib.name === 'bem-components' && platforms.push(lib.name + '/design/' + platform + '.blocks');
        });
    });

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
            inBlocks: {
                V2: [ getTechDecl('bemdecl.js'), getTechDecl('deps.js')],
                notV2: [],
                defaultTechs: []
            },
            inMake: {
                techs: [ 'bemdecl.js', 'deps.js'],
                forked: []
            },
            inBundles: [],
            inJSON: []
        },
        inBlocks = technologies.inBlocks,
        inBundles = technologies.inBundles,
        inMake = technologies.inMake,
        inJSON = technologies.inJSON;   // to 'package.json'

    Object.keys(techs).forEach(function(tech) {
        switch (techs[tech]) {
            case 'bemjson.js':  // puts 'bemjson.js' on the top (it always goes the first in technologies)
                inMake.techs.unshift('bemjson.js');
                break;
            case 'browser.js+bemhtml':  // 'bem-core' --> 'browser.js+bemhtml' ==> 'vanilla.js', 'browser.js' and 'js'
                inBlocks.V2.push(getTechDecl('js')),
                inBlocks.notV2.push('browser.js', 'vanilla.js'),
                inBlocks.defaultTechs.push('browser.js');

                inBundles.push('browser.js+bemhtml');

                inMake.techs.push('browser.js+bemhtml');
                inMake.forked.push('browser.js+bemhtml');
                break;
            case 'node.js': // 'bem-core' --> 'node.js' ==> 'vanilla.js' and 'js'
                inBlocks.V2.push(getTechDecl('js')),
                inBlocks.notV2.push('node.js', 'vanilla.js');

                inMake.techs.push('node.js');
                break;
            case 'bemhtml':
                inBlocks.notV2.push('bemhtml');
                inBlocks.defaultTechs.push('bemhtml');

                inMake.techs.push('bemhtml');
                break;
            case 'bemtree':
                inBlocks.notV2.push('bemtree');

                inMake.techs.push('bemtree');
                break;
            case 'html':
                inBundles.push('html');

                inMake.techs.push('html');
                break;
            case 'roole':
                inBlocks.V2.push(getTechDecl('roole'));
                inBlocks.defaultTechs.push('roole');

                inMake.techs.push('roole');
                inMake.forked.push('roole');

                inJSON.push('roole');
                break;
            default:
                inBlocks.V2.push(getTechDecl(techs[tech]));

                inMake.techs.push(techs[tech]);
        }
    });

    inBlocks.defaultTechs.indexOf('roole') === -1 && inBlocks.defaultTechs.push('css');

    technologies.inBlocks.V2 = _.uniq(inBlocks.V2);
    technologies.inBlocks.notV2 = _.uniq(inBlocks.notV2);

    return technologies;
}

// preprocessors: 'roole', 'pure css'
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
