'use strict';
var _ = require('lodash');

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
                level.indexOf('touch-') === -1 && // 'touch-pad' and 'touch-phone' can not be added
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
    if (templateEngine !== 'my') { techs.push(templateEngine); }

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
            inTechs: [],
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

    isAutoprefixer && inJSON.push({
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
    inTargets.push(toMinify.indexOf('css') > -1 ? '_?.css' : '?.css');

    techs.map(function (tech) {
        switch (tech) {
            case 'bemjson.js': // 'bemjson.js' ==> only 'inTechs'
                inTechs.push(config.techs.enb['bemjson.js']);
                break;

            case 'css':
                inTechs.push(config.techs.enb[isAutoprefixer ? 'css+autoprefixer' : 'css']);
                break;

            case 'stylus':
                inTechs.push(config.techs.enb[isAutoprefixer ? 'stylus+autoprefixer' : 'stylus']);

                inJSON.push({
                    name: 'enb-stylus',
                    version: config.versions.deps['enb-stylus']
                });
                break;

            case 'node.js':
                inTechs.push(config.techs.enb['node.js']);

                inTargets.push(toMinify.indexOf('node.js') > -1 ? '_?.node.js' : '?.node.js');

                inJSON.push({
                    name: 'enb-diverse-js',
                    version: config.versions.deps['enb-diverse-js']
                }, {
                    name: 'enb-modules',
                    version: config.versions.deps['enb-modules']
                });
                break;

            case 'browser.js':
                if (techs.indexOf('bemhtml') > -1 || techs.indexOf('bh') > -1) {
                    var techVal = config.techs.enb['browser.js+template'];

                    techs.indexOf('bemhtml') > -1 &&
                        (techVal = techVal.replace('browser.template.js', 'browser.bemhtml.js'));
                    techs.indexOf('bh') > -1 && (techVal = techVal.replace('browser.template.js', 'browser.bh.js'));

                    inTechs.push(techVal);
                } else {
                    inTechs.push(config.techs.enb['browser.js']);
                }

                inTargets.push(toMinify.indexOf('js') > -1 ? '_?.js' : '?.js');  // 'bem-core' --> 'browser.js' ==> 'js'

                inJSON.push({
                    name: 'enb-diverse-js',
                    version: config.versions.deps['enb-diverse-js']
                }, {
                    name: 'enb-modules',
                    version: config.versions.deps['enb-modules']
                });
                break;

            case 'bemtree':
                inTechs.push(config.techs.enb['bemtree']);

                inTargets.push(toMinify.indexOf('bemtree.js') > -1 ? '_?.bemtree.js' : '?.bemtree.js');

                inJSON.push({
                    name: 'enb-bemxjst',
                    version: config.versions.deps['enb-bemxjst']
                });
                break;

            case 'bemhtml':   // 'bem-core' ==> 'bemhtml-old' from package 'enb-bemxjst'
                inTechs.push(config.techs.enb['bemhtml']);
                if (techs.indexOf('browser.js') > -1) {
                    inTechs.push(config.techs.enb['bemhtml-client']);
                }

                inTargets.push(toMinify.indexOf('bemhtml.js') > -1 ? '_?.bemhtml.js' : '?.bemhtml.js');

                inJSON.push({
                    name: 'enb-bemxjst',
                    version: config.versions.deps['enb-bemxjst']
                });
                break;

            case 'bh':
                inTechs.push(config.techs.enb['bh']);
                if (techs.indexOf('browser.js') > -1) {
                    inTechs.push(config.techs.enb['bh-client']);
                }

                inTargets.push(toMinify.indexOf('bh.js') > -1 ? '_?.bh.js' : '?.bh.js');

                inJSON.push({
                    name: 'enb-bh',
                    version: config.versions.deps['enb-bh']
                }, {
                    name: 'bh',
                    version: config.versions.deps['bh']
                });
                break;

            case 'html': // 'bh' ==> 'enb-bh' | 'bemhtml' ==> 'enb-bemxjst' in 'html' require path
                techs.indexOf('bemhtml') > -1 && inTechs.push(config.techs.enb['html-from-bemhtml']);
                techs.indexOf('bh') > -1 && inTechs.push(config.techs.enb['html-from-bh']);

                inTargets.push('?.html');
                break;

            default:
                inTechs.push(config.techs.enb[tech]);

                inTargets.push(toMinify.indexOf(tech) > -1 ? '_?.' + tech : '?.' + tech);
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
                url: techs.indexOf('?.css') > -1 ? 'index.css' : '_index.css'
            }],
            ies: []
        },
        ies = ['?.ie.css', '?.ie8.css', '?.ie9.css'];

    ies.forEach(function (ie) {
        var isIE = techs.indexOf(ie) > -1;
        (isIE || techs.indexOf('_' + ie) > -1) && styles.ies.push({
            elem: 'css',
            url: isIE ? 'index' + ie.replace('?', '') : '_index' + ie.replace('?', '')
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

    (techs.indexOf('?.js') > -1 || techs.indexOf('_?.js') > -1) && scripts.push({
        elem: 'js',
        url: techs.indexOf('?.js') > -1 ? 'index.js' : '_index.js'
    });

    return scripts;
}

module.exports = {
    getPlatforms: getPlatforms,
    addPreprocessor: addPreprocessor,
    addTemplateEngine: addTemplateEngine,
    getTechnologies: getTechnologies,
    getBrowsers: getBrowsers,
    getStyles: getStyles,
    getScripts: getScripts
};
