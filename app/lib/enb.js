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
            platform.indexOf('touch-') === -1 &&   // 'bem-bl' ==> 'blocks-common', 'blocks-desktop', 'blocks-touch' ...
                platforms.push(lib.name + '/' + platform + '.blocks');

            design && lib.name === 'bem-components' && platforms.push(lib.name + '/design/' + platform + '.blocks');
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

    Object.keys(techs).forEach(function(tech) {
        switch(techs[tech]) {
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
                inTechs.push(getTechVal(techs[tech]));
                inTargets.push(toMinify.indexOf(techs[tech]) > -1 ? 'min.' + techs[tech] : techs[tech]);

                (techs[tech] === 'node.js' || techs[tech] === 'browser.js') && inJSON.push('enb-diverse-js');
                techs[tech] === 'bemtree.js' && inJSON.push('enb-bemxjst');

        }
    });

    technologies.inTechs = _.uniq(inTechs);
    technologies.inTargets = _.uniq(inTargets);
    technologies.inJSON = _.uniq(inJSON);

    return technologies;
}

// preprocessors: 'stylus', 'roole', 'less', 'pure css'
exports.addPreprocessor = function(input, preprocessor) {
    // 'bem-core' --> 'bem-components' --> 'design' ==> 'preprocessor === undefined' ==> 'design-roole'
    input.push(preprocessor || 'design-roole');

    return input;
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
