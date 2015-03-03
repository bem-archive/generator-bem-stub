'use strict';
var _ = require('lodash');

/**
 * Returns platforms with path and without path
 * @example
 *  [['common', 'desktop'], ['common', 'touch', 'touch-pad']] and [{ name: 'bem-core', version: '' }] ==>
 *
 *      ->  withPath:
 *              { desktop: ['bem-core/common.blocks', 'bem-core/desktop.blocks'],
 *                'touch-pad':
 *                  ['bem-core/common.blocks',
 *                   'bem-core/touch.blocks',
 *                   'bem-core/touch-pad.blocks'] },
 *      ->  withouPath:
 *              { desktop: ['common', 'desktop'],
 *                'touch-pad': ['common', 'touch', 'touch-pad'] } }
 *
 * @param {Object[]} pls
 * @param {Object[]} libs
 * @param {Boolean} isDesign
 * @returns {Object}
 */
function getPlatforms(pls, libs, isDesign) {
    var platforms = {
            withPath: {},
            withoutPath: {}
        };

    pls.map(function (pl) {
        var platform = pl[pl.length - 1];

        platforms.withPath[platform] = [];
        platforms.withoutPath[platform] = pl;

        libs.map(function (lib) {
            pl.map(function (level) {
                platforms.withPath[platform].push(lib.name + '/' + level + '.blocks');

                isDesign && lib.name === 'bem-components' &&
                    platforms.withPath[platform].push(lib.name + '/design/' + level + '.blocks');
            });
        });
    });

    return platforms;
}

/**
 * Adds the chosen preprocessor to technologies
 * @param {Object[]} techs
 * @param {String} preprocessor
 * @returns {Object[]}
 */
function addPreprocessor(techs, preprocessor) {
    if (preprocessor === 'css') {
        techs.splice(techs.indexOf('bemjson.js') + 1, 0, 'css');
    } else {  // 'bem-core' --> 'bem-components' ==> 'preprocessor === undefined' ==> 'stylus'
        techs.splice(techs.indexOf('bemjson.js') + 1, 0, preprocessor ? preprocessor : 'stylus', 'css');
    }

    return techs;
}

/**
 * Adds 'ie.css' to technologies
 * @param {Object[]} techs
 * @returns {Object[]}
 */
function addIe(techs) {
    if (techs.indexOf('ie.css') > -1) return techs;

    var ie = /ie[0-9]{1,2}\.css/.exec(techs);

    if (ie) {
        techs.splice(techs.indexOf(ie[0]), 0, 'ie.css');
    }

    return techs;
}

/**
 * Adds the template engine to technologies
 * @param {Object[]} techs
 * @returns {Object[]}
 */
function addTemplateEngine(techs, templateEngine) {
    if (templateEngine === 'my') return techs;

    var scripts = ['node.js', 'browser.js+bemhtml'],
        index = -1;

    for (var i = 0; i < scripts.length; i++) {
        index = techs.indexOf(scripts[i]);
        if (index > -1) break;
    }

    index > -1 ? techs.splice(index, 0, templateEngine) : techs.push(templateEngine);

    return techs;
}

/**
 * Returns technologies
 * @param {Object} config
 * @param {Object[]} techs
 * @param {Boolean} isAutoprefixer
 * @returns {Object}
 */
function getTechnologies(config, techs, isAutoprefixer) {
    /*
        for example, returns ==> bemdecl.js'         : 'v2/bemdecl.js'
    */
    function getTechDecl(tech) {
        function getTechVal(tech) {
            var _tech = config.techs['bem-tools'][tech];

            return '\'' + _tech + '\'';
        }

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
                V2: [getTechDecl('bemdecl.js'), getTechDecl('deps.js')],
                notV2: [],
                defaultTechs: []
            },
            inMake: {
                techs: ['bemdecl.js', 'deps.js'],
                forked: []
            },
            inBundles: [],
            inJSON: ['bower', 'bower-npm-install', 'bem', 'bem-environ'].map(function (dep) {
                return {
                    name: dep,
                    version: config.versions.deps[dep]
                };
            })
        },
        inBlocks = technologies.inBlocks,
        inBundles = technologies.inBundles,
        inMake = technologies.inMake,
        inJSON = technologies.inJSON,
        hasPreprocessor = false;

    isAutoprefixer && inJSON.push({
        name: 'bem-tools-autoprefixer',
        version: config.versions.deps['bem-tools-autoprefixer']
    });

    techs.map(function (tech) {
        switch (tech) {
            case 'bemjson.js':  // puts 'bemjson.js' on the top (it always goes the first in technologies)
                inMake.techs.unshift('bemjson.js');
                break;

            case 'browser.js+bemhtml':  // 'bem-core' --> 'browser.js+bemhtml' ==> 'vanilla.js', 'browser.js' and 'js'
                inBlocks.V2.push(getTechDecl('js'));
                inBlocks.notV2.push('browser.js', 'vanilla.js');
                inBlocks.defaultTechs.push('browser.js');

                inBundles.push('browser.js+bemhtml');

                inMake.techs.push('browser.js+bemhtml');
                inMake.forked.push('browser.js+bemhtml');
                break;

            case 'node.js': // 'bem-core' --> 'node.js' ==> 'vanilla.js' and 'js'
                inBlocks.V2.push(getTechDecl('js'));
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
                if (tech === 'stylus') {
                    inBlocks.defaultTechs.push(tech);

                    inMake.forked.push(tech);

                    inJSON.push({
                        name: tech,
                        version: config.versions.deps[tech]
                    });

                    hasPreprocessor = true;
                }

                inBlocks.V2.push(getTechDecl(tech));

                inMake.techs.push(tech);
        }
    });

    if (!hasPreprocessor) {
        inBlocks.defaultTechs.unshift('css');
    }

    technologies.inBlocks.V2 = _.uniq(inBlocks.V2);
    technologies.inBlocks.notV2 = _.uniq(inBlocks.notV2);

    return technologies;
}

/**
 * Returns browsers for given platforms
 * @example
 *  { desktop: ['common', 'desktop'] } ==> { desktop: ['last 2 versions', 'ie 10', 'ff 24', 'opera 12.16'] }
 *
 * @param {Object} config
 * @param {Object} platforms --> without path
 * @returns {Object}
 */
function getBrowsers(config, platforms) {
    var browsers = {};

    Object.keys(platforms).forEach(function (platform) {
        browsers[platform] = config.browsers[platform];
    });

    return browsers;
}

/**
 * Returns styles which will be added to 'index.bemjson.js'
 * @example
 * ['css',     ==>         {
 *  'ie.css',                  css: [{
 *  'ie8.css']                     elem: 'css',
 *                                 url: '_index.css'
 *                             }],
 *                             ies: [{
 *                                 elem: 'css',
 *                                 url: '_index.ie.css'
 *                             }, {
 *                                 elem: 'css',
 *                                 url: '_index.ie8.css'
 *                             }]
 *                         }
 *
 * @param {Object[]} techs
 * @returns {Object}
 */
function getStyles(techs) {
    var styles = {
            css: [{ elem: 'css', url: '_index.css' }],
            ies: []
        },
        ies = ['ie.css', 'ie8.css', 'ie9.css'];

    ies.forEach(function (ie) {
        var isIE = techs.indexOf(ie) > -1;
        isIE && styles.ies.push({
            elem: 'css',
            url: '_index.' + ie
        });
    });

    return styles;
}

/**
 * Returns scripts which will be added to 'index.bemjson.js'
 * @example
 * ['browser.js+bemhtml']  ==>  [{ elem: 'js', url: '_index.js' }]
 *
 * @param {Object[]} techs
 * @returns {Object}
 */
function getScripts(techs) {
    var scripts = [];

    techs.indexOf('browser.js+bemhtml') > -1 && scripts.push({
        elem: 'js', url: '_index.js'
    });

    return scripts;
}

module.exports = {
    getPlatforms: getPlatforms,
    addPreprocessor: addPreprocessor,
    addIe: addIe,
    addTemplateEngine: addTemplateEngine,
    getTechnologies: getTechnologies,
    getBrowsers: getBrowsers,
    getStyles: getStyles,
    getScripts: getScripts
};
