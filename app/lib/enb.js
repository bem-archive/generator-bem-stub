'use strict';
var fs = require('fs'),
    _ = require('lodash');

// technologies
var commonTechs = [
        { name: 'BEMJSON', value: 'bemjson.js' },
        { value: 'ie.css' },
        { value: 'ie6.css' },
        { value: 'ie7.css' },
        { value: 'ie8.css' },
        { value: 'ie9.css' }
    ],
    templates = {
        core: [{ name: 'BEMTREE', value: 'bemtree.js' }]
    },
    scripts = {
        coreWithoutLocal: [
            { value: 'node.js' },
            { value: 'browser.js' }
        ]
    };

/**
 * Returns platforms with path and without path
 * @example
 *  [['common', 'desktop'], ['common', 'touch', 'touch-pad']] and [{ name: 'bem-core', version: '' }] ==>
 *
 *      -->  withPath:
 *               { desktop: ['bem-core/common.blocks', 'bem-core/desktop.blocks'],
 *                 'touch-pad': ['bem-core/common.blocks', 'bem-core/touch.blocks'] }
 *      -->  withouPath:
 *               { desktop: ['common', 'desktop'],
 *                 'touch-pad': ['common', 'touch', 'touch-pad'] } }
 *
 * @param {Array of arrays} pls
 * @param {Array of objects} libs
 * @param {Boolean} design
 * @returns {Object}
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
                level.indexOf('touch-') === -1 && // 'touch-pad' and 'touch-phone' can not be added
                    platforms.withPath[platform].push(lib.name + '/' + level + '.blocks');

                design && lib.name === 'bem-components' && platforms.withPath[platform].push(lib.name + '/design/' + level + '.blocks');
            });
        });
    });

    return platforms;
}

/**
 * Adds the chosen preprocessor to technologies
 * @param {Array} techs
 * @param {String} preprocessor
 * @returns {Array}
 */
function addPreprocessor(techs, preprocessor) {
    // 'bem-core' --> 'bem-components' ==> 'preprocessor === undefined' ==> 'stylus'
    techs.push(preprocessor || 'stylus');

    return techs;
}

/**
 * Adds the chosen template system to technologies
 * @param {Array} techs
 * @returns {Array}
 */
function addTemplateSystem(techs, templateSystem) {
    if (templateSystem !== 'my') techs.push(templateSystem);

    return techs;
}

/**
 * Returns technologies
 * @param {String} configPath
 * @param {Array} techs
 * @param {Array} toMinify
 * @returns {Object}
 */
function getTechnologies(configPath, techs, toMinify) {

    function getTechVal(tech) {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8')).technologies.enb[tech];
    }

    /*
       'inTechs' ==> '.enb/make.js' --> 'nodeConfig.addTechs',
       'inTargets' ==> '.enb/make.js' --> 'nodeConfig.addTargets',
       'inJSON' ==> 'package.json'
    */

    var technologies = {
            inTechs : ['require(\'enb/techs/files\')', 'require(\'enb/techs/deps\')'],  // 'files' and 'deps' are always included
            inTargets : [],
            inJSON : []
        },
        inTechs = technologies.inTechs,
        inTargets = technologies.inTargets,
        inJSON = technologies.inJSON;

    // 'css' will be always added 'inTargets'
    inTargets.push(toMinify.indexOf('css') > -1 ? 'min.css' : 'css');

    techs.map(function(tech) {
        switch(tech) {

            case 'bemjson.js': // 'bemjson.js' ==> only 'inTechs'
                inTechs.push(getTechVal('bemjson.js'));
                break;

            case 'stylus':
                inTechs.push(getTechVal('stylus'));

                inJSON.push('enb-stylus');
                break;

            case 'roole':
                inTechs.push(getTechVal('roole'));

                inJSON.push('roole', 'enb-roole');  // 'roole' ==> 'roole', 'enb-roole' in 'package.json'
                break;

            case 'less':
                inTechs.push(getTechVal('less'));

                inJSON.push('less');
                break;

            case 'browser.js':
                inTechs.push(getTechVal('browser.js'));

                inTargets.push(toMinify.indexOf('js') > -1 ? 'min.js' : 'js');  // 'bem-core' --> 'browser.js' ==> 'js'

                inJSON.push('enb-diverse-js');
                break;

            case 'bemhtml':   // 'bem-core' ==> 'bemhtml-old' from package 'enb-bemxjst'
                inTechs.push(getTechVal('core-bemhtml'));

                inTargets.push(toMinify.indexOf('bemhtml.js') > -1 ? 'min.bemhtml.js' : 'bemhtml.js');

                inJSON.push('enb-bemxjst');
                break;

            case 'bh':
                inTechs.push(getTechVal('bh'));

                inTargets.push(toMinify.indexOf('bh.js') > -1 ? 'min.bh.js' : 'bh.js');

                inJSON.push('enb-bh', 'bh');
                break;

            case 'html': // 'bh' ==> 'enb-bh' in 'html' require path | 'bemhtml' ==> 'enb-bemxjst' in 'html' require path
                var techVal = getTechVal('html');

                techs.indexOf('bemhtml') > -1 && (techVal = techVal.replace('enb', 'enb-bemxjst'));

                techs.indexOf('bh') > -1 && (techVal = techVal.replace('enb', 'enb-bh'));

                inTechs.push(techVal);

                inTargets.push('html');
                break;

            default:
                inTechs.push(getTechVal(tech));

                inTargets.push(toMinify.indexOf(tech) > -1 ? 'min.' + tech : tech);

                tech === 'node.js' && inJSON.push('enb-diverse-js');
                tech === 'bemtree.js' && inJSON.push('enb-bemxjst');

        }
    });

    technologies.inTargets = _.uniq(inTargets);

    return technologies;
}

/**
 * Returns browsers for given platforms
 * @example
 *  { desktop: ['common', 'desktop'] } ==> { desktop: ['last 2 versions', 'ie 10', 'ff 24', 'opera 12.16'] }
 *
 * @param {String} configPath
 * @param {Object} platforms --> without path
 * @returns {Object}
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
 * ['min.css',     ==>      {
 *  'ie.css',                   css: [{
 *  'ie6.css',                      elem: 'css',
 *  'min.ie9.css']                  url: 'min.css'
 *                              }],
 *                              ies: [{
 *                                  elem: 'css',
 *                                  url: 'ie.css',
 *                              }, {
 *                                  elem: 'css',
 *                                  url: 'ie6.css',
 *                              }, {
 *                                  elem: 'css',
 *                                  url: 'min.ie9.css',
 *                              }]
 *                          }
 *
 * @param {Array} techs
 * @returns {Object}
 */
function getStyles(techs) {
    var styles = {
        css: [{
            elem: 'css',
            url: techs.indexOf('css') > -1 ? 'css' : 'min.css'
        }],
        ies: []
    };

    var ies = ['ie.css', 'ie6.css', 'ie7.css', 'ie8.css', 'ie9.css'];
    ies.forEach(function(ie) {
        var isIE = techs.indexOf(ie) > -1;
        (isIE || techs.indexOf('min.' + ie) > -1) && styles.ies.push({
            elem: 'css',
            url: isIE ? ie : 'min.' + ie
        });
    });

    return styles;
}

/**
 * Returns scripts which will be added to 'index.bemjson.js'
 * @example
 * ['min.js']       ==>     [{ elem: 'js', url: 'min.js' }]
 *
 * @param {Array} techs
 * @returns {Object} scripts
 */

function getScripts(techs) {
    var scripts = [];

    (techs.indexOf('js') > -1 || techs.indexOf('min.js') > -1) && scripts.push({
        elem: 'js',
        url: techs.indexOf('js') > -1 ? 'js' : 'min.js'
    });

    return scripts;
}

module.exports = {
    // fields
    commonTechs: commonTechs,
    templates: templates,
    scripts: scripts,

    // methods
    getPlatforms: getPlatforms,
    addPreprocessor: addPreprocessor,
    addTemplateSystem: addTemplateSystem,
    getTechnologies: getTechnologies,
    getBrowsers: getBrowsers,
    getStyles: getStyles,
    getScripts: getScripts
};
