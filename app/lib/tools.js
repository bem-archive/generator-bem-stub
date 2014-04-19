'use strict';
var fs = require('fs'),
    _ = require('lodash');

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

/**
 * Returns platforms with path and without path
 *
 * @example
 *  [ [ 'common', 'desktop' ], [ 'common', 'touch', 'touch-pad' ] ] and [ 'bem-core' ] ==>
 *
 *      ->  withPath:
 *              { desktop: [ 'bem-core/common.blocks', 'bem-core/desktop.blocks' ],
 *                'touch-pad':
 *                  [ 'bem-core/common.blocks',
 *                    'bem-core/touch.blocks',
 *                    'bem-core/touch-pad.blocks' ] },
 *      ->  withouPath:
 *              { desktop: [ 'common', 'desktop' ],
 *                'touch-pad': [ 'common', 'touch', 'touch-pad' ] } }
 *
 * @param {Array of arrays} pls
 * @param {Array} libs
 * @param {Boolean} design
 * @returns {Object} platforms
 */

exports.getPlatforms = function(pls, libs, design) {
    var platforms = {
        withPath: {},
        withoutPath: {}
    };

    pls.map(function(pl) {
        var platform = pl[pl.length - 1];

        platforms.withPath[platform] = [];
        platforms.withoutPath[platform] = pl;

        libs.map(function(lib) {
            pl.map(function(level) {
                platforms.withPath[platform].push(lib.name + '/' + level + '.blocks');

                design && lib.name === 'bem-components' && platforms.withPath[platform].push(lib.name + '/design/' + level + '.blocks');
            });
        });
    });

    return platforms;
}

/**
 * Returns technologies
 *
 * @param {String} configPath
 * @param {Array} techs
 * @returns {Object} technologies
 */

exports.getTechnologies = function(configPath, techs) {

    function getTechDecl(tech) {

        function getTechVal(tech) {
            var _tech = JSON.parse(fs.readFileSync(configPath).toString()).technologies.tools[tech];

            return '\'' + _tech + '\'';
        }

        /*
            for example, returns ==>

                'bemdecl.js'         : 'v2/bemdecl.js'
        */
        return '\'' + tech + '\'' + new Array(22 - tech.length).join(' ') + ': ' + getTechVal(tech);
    }

    /*
        'inBlocks' ==> '.bem/levels/blocks.js'
            'V2'           -->  'techs',
            'notV2'        -->  'techs' from 'bem-core' library,
            'defaultTechs' -->  'exports.defaultTechs'

        'inMake' ==> '.bem/make.js'
            techs   --> 'getTechs',
            forked  --> 'getForkedTechs'

        'inBundles' ==> '.bem/levels/bundles.js' --> use 'techs' from 'bem-core' library,
        'inJSON' ==> 'package.json'

    */

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
        inJSON = technologies.inJSON;

    techs.map(function(tech) {
        switch (tech) {
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
                inBlocks.V2.push(getTechDecl(tech));

                inMake.techs.push(tech);
        }
    });

    inBlocks.defaultTechs.indexOf('roole') === -1 && inBlocks.defaultTechs.push('css');

    technologies.inBlocks.V2 = _.uniq(inBlocks.V2);
    technologies.inBlocks.notV2 = _.uniq(inBlocks.notV2);

    return technologies;
}

/**
 * Adds chosen preprocessor in technologies
 *
 * @param {Array} techs
 * @param {String} preprocessor
 * @returns {Array} techs
 */

exports.addPreprocessor = function(techs, preprocessor) {
    if (preprocessor === 'css') {
        techs.splice(techs.indexOf('bemjson.js') + 1, 0, 'css');

        return techs;
    }
    else if (preprocessor === 'roole' || !preprocessor) {
        techs.splice(techs.indexOf('bemjson.js') + 1, 0, 'roole', 'css');

        return techs;
    }

    techs.splice(techs.indexOf('bemjson.js') + 1, 0, preprocessor);

    return techs;
}

/**
 * Adds 'ie.css' to technologies
 *
 * @param {Array} techs
 * @returns {Array} techs
 */

exports.addIe = function(techs) {
    var ie = /ie[0-9]{0,2}\.css/.exec(techs);

    if (ie) {
        techs.splice(techs.indexOf(ie[0]), 0, 'ie.css');
        techs = _.uniq(techs);
    }

    return techs;
}

/**
 * Returns browsers for given platforms
 *
 * @param {String} configPath
 * @param {Object} platforms
 * @returns {Object} browsers
 */

exports.getBrowsers = function(configPath, platforms) {
    var browsers = {};

    Object.keys(platforms).forEach(function(platform) {
        browsers[platform] = JSON.parse(fs.readFileSync(configPath).toString()).autoprefixer[platform];
    });

    return browsers;
}
