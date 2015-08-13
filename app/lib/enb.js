'use strict';
var _ = require('lodash');

/**
 * Returns redefinition levels
 * @example
 *  [['common', 'desktop'], ['common', 'touch', 'touch-pad']] and [{ name: 'bem-core', version: '' }] ==>
 *
 *      -->  libsLevels:
 *               { desktop: ['bem-core/common.blocks', 'bem-core/desktop.blocks'],
 *                 'touch-pad': ['bem-core/common.blocks', 'bem-core/touch.blocks'] }
 *      -->  projectLevels:
 *               { desktop: ['common', 'desktop'],
 *                 'touch-pad': ['common', 'touch', 'touch-pad'] } }
 *
 * @param {Object[]} lvls
 * @param {Object[]} libs
 * @param {Boolean} isDesign
 * @returns {Object}
 */
function getLevels(lvls, libs, isDesign) {
    var levels = {
        libsLevels: {},
        projectLevels: {}
    };

    lvls.forEach(function (lvl) {
        var level = lvl[lvl.length - 1];

        levels.libsLevels[level] = [];
        levels.projectLevels[level] = lvl;

        libs.forEach(function (lib) {
            lvl.forEach(function (platform) {
                if (lib.name === 'bem-core' && platform.indexOf('touch-') > -1) {
                    return;
                }

                levels.libsLevels[level].push(lib.name + '/' + platform + '.blocks');

                isDesign && lib.name === 'bem-components' &&
                    levels.libsLevels[level].push(lib.name + '/design/' + platform + '.blocks');
            });
        });
    });

    return levels;
}

/**
 * Adds the chosen preprocessor to technologies
 * @param {Object[]} techs
 * @param {String} preprocessor
 * @returns {Object[]}
 */
function addPreprocessor(techs, preprocessor) {
    // 'bem-core' --> 'bem-components' ==> 'preprocessor === undefined' ==> 'stylus'
    techs.push(preprocessor || 'stylus');

    return techs;
}

/**
 * Adds the chosen template engine to technologies
 * @param {Object[]} techs
 * @returns {Object[]}
 */
function addTemplateEngine(techs, templateEngine) {
    techs.push(templateEngine);

    return techs;
}

/**
 * Returns technologies
 * @param {Object} config
 * @param {Object[]} techs
 * @param {Boolean} isAutoprefixer
 * @param {Object[]} toMinify
 * @returns {Object}
 */
function getTechnologies(config, techs, isAutoprefixer, toMinify) {
    /*
       'inTechs' ==> '.enb/make.js' --> 'nodeConfig.addTechs',
       'inTargets' ==> '.enb/make.js' --> 'nodeConfig.addTargets',
       'inJSON' ==> 'package.json'
    */

    var technologies = {
            // 'files' and 'deps' are always included
            inTechs: {},
            inTargets: [],
            inJSON: ['bower', 'enb', 'enb-bem-techs'].map(function (dep) {
                return {
                    name: dep,
                    version: config.versions.deps[dep]
                };
            })
        },
        inTechs = technologies.inTechs,
        inTargets = technologies.inTargets,
        inJSON = technologies.inJSON;

    techs.indexOf('stylus') === -1 && isAutoprefixer && inJSON.push({
        name: 'enb-autoprefixer',
        version: config.versions.deps['enb-autoprefixer']
    });

    toMinify.length > 0 && inJSON.push({
        name: 'enb-borschik',
        version: config.versions.deps['enb-borschik']
    });

    toMinify.indexOf('css') > -1 && inJSON.push({
        name: 'borschik-tech-cleancss',
        version: config.versions.deps['borschik-tech-cleancss']
    });

    // 'css' will be always added 'inTargets'
    inTargets.push(toMinify.indexOf('css') > -1 ? '?.min.css' : '?.css');

    techs.map(function (tech) {
        switch (tech) {
            case 'bemjson.js': // 'bemjson.js' ==> only 'inTechs'
                inTechs['bemjson.js'] = true;
                break;

            case 'css':
                inTechs['css'] = true;
                break;

            case 'stylus':
                inTechs['stylus'] = true;

                inJSON.push({
                    name: 'enb-stylus',
                    version: config.versions.deps['enb-stylus']
                });
                break;

            case 'node.js':
                inTechs['node.js'] = true;

                inTargets.push(toMinify.indexOf('node.js') > -1 ? '?.min.node.js' : '?.node.js');

                inJSON.push({
                    name: 'enb-diverse-js',
                    version: config.versions.deps['enb-diverse-js']
                }, {
                    name: 'enb-modules',
                    version: config.versions.deps['enb-modules']
                });
                break;

            case 'browser.js':
                inTechs['browser.js'] = true;

                inTargets.push(toMinify.indexOf('js') > -1 ? '?.min.js' : '?.js');

                inJSON.push({
                    name: 'enb-diverse-js',
                    version: config.versions.deps['enb-diverse-js']
                }, {
                    name: 'enb-modules',
                    version: config.versions.deps['enb-modules']
                });
                break;

            case 'bemtree':
                inTechs['bemtree'] = true;

                inTargets.push(toMinify.indexOf('bemtree.js') > -1 ? '?.min.bemtree.js' : '?.bemtree.js');

                inJSON.push({
                    name: 'enb-bemxjst',
                    version: config.versions.deps['enb-bemxjst']
                });
                break;

            case 'bemhtml':   // 'bem-core' ==> 'bemhtml-old' from package 'enb-bemxjst'
                inTechs['bemhtml'] = true;

                inTargets.push(toMinify.indexOf('bemhtml.js') > -1 ? '?.min.bemhtml.js' : '?.bemhtml.js');

                inJSON.push({
                    name: 'enb-bemxjst',
                    version: config.versions.deps['enb-bemxjst']
                });
                break;

            case 'bh':
                inTechs['bh'] = true;

                inTargets.push(toMinify.indexOf('bh.js') > -1 ? '?.min.bh.js' : '?.bh.js');

                inJSON.push({
                    name: 'enb-bh',
                    version: config.versions.deps['enb-bh']
                });
                break;

            default:
                inTechs[tech] = true;

                inTargets.push(toMinify.indexOf(tech) > -1 ? '?.min.' + tech : '?.' + tech);
        }
    });

    technologies.inTargets = _.uniq(inTargets);
    technologies.inJSON = _.uniq(inJSON, 'name');

    return technologies;
}

/**
 * Returns browsers for given platforms
 * @example
 *  { desktop: ['common', 'desktop'] } ==> { desktop: ['last 2 versions', 'ie 10', 'ff 24', 'opera 12.1'] }
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
 * ['_?.css',     ==>      {
 *  '?.ie.css',                 css: [{
 *  '?.ie8.css',                   elem: 'css',
 *  '_?.ie9.css']                  url: '_index.css'
 *                              }],
 *                              ies: [{
 *                                  elem: 'css',
 *                                  url: 'index.ie.css'
 *                              }, {
 *                                  elem: 'css',
 *                                  url: 'index.ie8.css'
 *                              }, {
 *                                  elem: 'css',
 *                                  url: '_index.ie9.css'
 *                              }]
 *                          }
 *
 * @param {Object[]} techs
 * @returns {Object}
 */
function getStyles(techs) {
    var styles = {
            css: [{
                elem: 'css',
                url: techs.indexOf('?.css') > -1 ? 'index.css' : 'index.min.css'
            }],
            ies: []
        },
        ies = ['?.ie.css', '?.ie8.css', '?.ie9.css'];

    ies.forEach(function (ie) {
        var isIE = techs.indexOf(ie) > -1;
        (isIE || techs.indexOf(ie.replace('?.', '?.min.')) > -1) && styles.ies.push({
            elem: 'css',
            url: isIE ? 'index' + ie.replace('?', '') : 'index.min' + ie.replace('?', '')
        });
    });

    return styles;
}

/**
 * Returns scripts which will be added to 'index.bemjson.js'
 * @example
 * ['_?.js']       ==>     [{ elem: 'js', url: '_index.js' }]
 *
 * @param {Object[]} techs
 * @returns {Object} scripts
 */

function getScripts(techs) {
    var scripts = [];

    (techs.indexOf('?.js') > -1 || techs.indexOf('?.min.js') > -1) && scripts.push({
        elem: 'js',
        url: techs.indexOf('?.js') > -1 ? 'index.js' : 'index.min.js'
    });

    return scripts;
}

module.exports = {
    getLevels: getLevels,
    addPreprocessor: addPreprocessor,
    addTemplateEngine: addTemplateEngine,
    getTechnologies: getTechnologies,
    getBrowsers: getBrowsers,
    getStyles: getStyles,
    getScripts: getScripts
};
