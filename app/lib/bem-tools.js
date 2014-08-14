'use strict';
var fs = require('fs'),
    _ = require('lodash');

// technologies
var commonTechs = [
    { value: 'bemjson.js' },
    { value: 'ie.css' },
    { value: 'ie6.css' },
    { value: 'ie7.css' },
    { value: 'ie8.css' },
    { value: 'ie9.css' }
],
templates = {
    core: [
        { value: 'bemtree'  },
        { value: 'bemhtml' }
    ]
},
scripts = {
    coreWithoutLocal: [
        { value: 'node.js' },
        { value: 'browser.js+bemhtml' }
    ],
};

/**
 * Returns platforms with path and without path
 *
 * @example
 *  [ [ 'common', 'desktop' ], [ 'common', 'touch', 'touch-pad' ] ] and [ { name: 'bem-core', version: '' } ] ==>
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
 * @param {Array of objects} libs
 * @param {Boolean} design
 * @returns {Object} platforms
 */

function getPlatforms(pls, libs, design) {
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
 * Adds chosen preprocessor in technologies
 *
 * @param {Array} techs
 * @param {String} preprocessor
 * @returns {Array} techs
 */

function addPreprocessor(techs, preprocessor) {
    if (preprocessor === 'css') {
        techs.splice(techs.indexOf('bemjson.js') + 1, 0, 'css');
    }
    else {
        techs.splice(techs.indexOf('bemjson.js') + 1, 0, preprocessor ? preprocessor : 'stylus', 'css');
    }

    return techs;
}

/**
 * Adds 'ie.css' to technologies
 *
 * @param {Array} techs
 * @returns {Array} techs
 */

function addIe(techs) {
    var ie = /ie[0-9]{0,2}\.css/.exec(techs);

    if (ie) {
        techs.splice(techs.indexOf(ie[0]), 0, 'ie.css');
        techs = _.uniq(techs);
    }

    return techs;
}

/**
 * Returns technologies
 *
 * @param {String} configPath
 * @param {Array} techs
 * @returns {Object} technologies
 */

function getTechnologies(configPath, techs) {

    function getTechDecl(tech) {

        function getTechVal(tech) {
            var _tech = JSON.parse(fs.readFileSync(configPath, 'utf-8')).technologies['bem-tools'][tech];

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

    var isPreprocessor = false;
    techs.map(function(tech) {
        switch(tech) {

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

            default:
                if (tech === 'roole' || tech === 'stylus' || tech === 'less') {
                    inBlocks.defaultTechs.push(tech);

                    inMake.forked.push(tech);

                    inJSON.push(tech);

                    isPreprocessor = true;
                }

                inBlocks.V2.push(getTechDecl(tech));

                inMake.techs.push(tech);
        }

    });

    if (!isPreprocessor) {
        inBlocks.defaultTechs.unshift('css');
    }

    technologies.inBlocks.V2 = _.uniq(inBlocks.V2);
    technologies.inBlocks.notV2 = _.uniq(inBlocks.notV2);

    return technologies;
}

/**
 * Returns browsers for given platforms
 * @example
 *  { desktop: [ 'common', 'desktop' ] } ==> { desktop: [ 'last 2 versions', 'ie 10', 'ff 24', 'opera 12.16' ] }
 *
 * @param {String} configPath
 * @param {Object} platforms --> without path
 * @returns {Object} browsers
 */

function getBrowsers(configPath, platforms) {
    var browsers = {};

    Object.keys(platforms).forEach(function(platform) {
        browsers[platform] = JSON.parse(fs.readFileSync(configPath, 'utf-8')).browsers[platform];
    });

    return browsers;
}

/**
 * Returns styles which will be added to 'index.bemjson.js'
 * @example
 * [ 'css',     ==>        {
 *   'ie.css',                 css: [{
 *   'ie6.css',                    elem: 'css',
 *                                 url: 'css'
 *                             }],
 *                             ies: [{
 *                                 elem: 'css',
 *                                 url: 'ie.css',
 *                             }, {
 *                                 elem: 'css',
 *                                 url: 'ie6.css',
 *                             }]
 *                         }
 *
 * @param {Array} techs
 * @returns {Object} styles
 */

function getStyles(techs) {
    var styles = {
        css: [{
            elem: 'css',
            url: 'css'
        }],
        ies: []
    };

    var ies = [ 'ie.css', 'ie6.css', 'ie7.css', 'ie8.css', 'ie9.css' ];
    ies.forEach(function(ie) {
        var isIE = techs.indexOf(ie) > -1;
        isIE && styles.ies.push({
            elem: 'css',
            url: ie
        });
    });

    return styles;
}

/**
 * Returns scripts which will be added to 'index.bemjson.js'
 * @example
 * [ 'js' ]     ==>         [{
 *                              elem: 'js',
 *                              url: 'js'
 *                          }]
 *
 * @param {Array} techs
 * @returns {Object} scripts
 */

function getScripts(techs) {
    var scripts = [];

    (techs.indexOf('browser.js+bemhtml') > -1 || techs.indexOf('node.js') > -1) && scripts.push({
        elem: 'js',
        url: 'js'
    });

    return scripts;
}

// fields
exports.commonTechs = commonTechs;
exports.templates = templates;
exports.scripts = scripts;

// methods
exports.getPlatforms = getPlatforms;
exports.addPreprocessor = addPreprocessor;
exports.addIe = addIe;
exports.getTechnologies = getTechnologies;
exports.getBrowsers = getBrowsers;
exports.getStyles = getStyles;
exports.getScripts = getScripts;
