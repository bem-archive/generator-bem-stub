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
        { value: 'bemtree.js'  } ]
},
exports.scripts = {
    coreWithoutLocal: [
        { value: 'node.js' },
        { value: 'browser.js' }
    ]
};

// receives, for example, pls['desktop', 'common'] and libs['bem-core'], returns platforms['bem-core/desktop.blocks', 'bem-core/common.blocks']
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
                level.indexOf('touch-') === -1 &&   // 'bem-bl' ==> 'blocks-common', 'blocks-desktop', 'blocks-touch' ...
                    platforms.withPath[platform].push(lib.name + '/' + level + '.blocks');

                design && lib.name === 'bem-components' && platforms.withPath[platform].push(lib.name + '/design/' + level + '.blocks');
            });
        });
    });

    return platforms;
}

// handles selected technologies
exports.getTechnologies = function(configPath, techs, toMinify) {
    function getTechVal(tech) {
        return JSON.parse(fs.readFileSync(configPath).toString()).technologies.enb[tech];
    }

    // 'inTechs' ==> 'nodeConfig.addTechs' | 'inTargets' ==> 'nodeConfig.addTargets'
    var technologies = {
            inTechs : [ 'require(\'enb/techs/files\')', 'require(\'enb/techs/deps\')' ],  // 'files' and 'deps' are always included
            inTargets : [],
            inJSON : []
        },
        inTechs = technologies.inTechs,
        inTargets = technologies.inTargets,
        inJSON = technologies.inJSON;   // to 'package.json'

    inTargets.push(toMinify.indexOf('css') > -1 ? 'min.css' : 'css');

    techs.map(function(tech) {
        switch(tech) {
            case 'bemjson.js': // 'bemjson.js' ==> only in techs
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
            case 'design-roole':
                inTechs.push(getTechVal('design-roole'));
                inJSON.push('roole', 'enb-roole');
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
            case 'bemhtml.js':   // 'bem-core' ==> 'bemhtml-old' from package 'enb-bemxjst'
                inTechs.push(getTechVal('core-bemhtml.js'));
                inTargets.push(toMinify.indexOf('bemhtml.js') > -1 ? 'min.bemhtml.js' : 'bemhtml.js');
                inJSON.push('enb-bemxjst');
                break;
            case 'bh':
                inTechs.push(getTechVal('bh'));
                inTargets.push(toMinify.indexOf('bemhtml.js') > -1 ? 'min.bemhtml.js' : 'bemhtml.js');   // 'bh' ==> '?.bemhtml.js' in 'targets'
                inJSON.push('bh');
                break;
            default:
                inTechs.push(getTechVal(tech));
                inTargets.push(toMinify.indexOf(tech) > -1 ? 'min.' + tech : tech);

                tech === 'node.js' && inJSON.push('enb-diverse-js');
                tech === 'bemtree.js' && inJSON.push('enb-bemxjst');

        }
    });

    technologies.inTechs = _.uniq(inTechs);
    technologies.inTargets = _.uniq(inTargets);
    technologies.inJSON = _.uniq(inJSON);

    return technologies;
}

// preprocessors: 'stylus', 'roole', 'less', 'pure css'
exports.addPreprocessor = function(techs, preprocessor) {
    // 'bem-core' --> 'bem-components' --> 'design' ==> 'preprocessor === undefined' ==> 'design-roole'
    techs.push(preprocessor || 'design-roole');

    return techs;
}

// To 'index.bemjson.js'
exports.getScripts = function(techs) {
    var scripts = [];

    (techs.indexOf('css') > -1 || techs.indexOf('min.css') > -1) && scripts.push({
        elem: 'css',
        url: techs.indexOf('css') > -1 ? 'css' : 'min.css'
    });

    (techs.indexOf('js') > -1 || techs.indexOf('min.js') > -1) && scripts.push({
        elem: 'js',
        url: techs.indexOf('js') > -1 ? 'js' : 'min.js'
    });

    return scripts;
}

exports.getBrowsers = function(configPath, platforms) {
    var browsers = {};

    Object.keys(platforms).forEach(function(platform) {
        browsers[platform] = JSON.parse(fs.readFileSync(configPath).toString()).autoprefixer[platform];
    });

    return browsers;
}
