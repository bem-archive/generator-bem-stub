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
        { value: 'bemtree.js'  } ],
    bl: [
        { value: 'bemhtml.js' }
    ]
},
exports.scripts = {
    coreWithoutLocal: [
        { value: 'node.js' },
        { value: 'browser.js' }
    ],
    blWithoutLocal: [
        { value: 'js' }
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
    for (var lib in libs) {
        for (var platform in pls) {

            if (libs[lib].name === 'bem-mvc' && (pls[platform].indexOf('touch') > -1 || pls[platform] === 'desktop')) continue;

            pls[platform].indexOf('touch-') === -1 &&
                platforms.push(libs[lib].name + '/' + (libs[lib].name !== 'bem-bl' ?  pls[platform] + '.blocks' : 'blocks-' + pls[platform]));

            design && libs[lib].name === 'bem-components' && platforms.push(libs[lib].name + '/design/' + pls[platform] + '.blocks');
        }
    }

    return platforms;
}

// handles selected technologies
exports.getTechnologies = function(configPath, techs, base, toMinify) {
    function getTechVal(tech) {
        return JSON.parse(fs.readFileSync(configPath).toString()).technologies.enb[tech];
    }

    // 'inTechs' ==> 'nodeConfig.addTechs' | 'inTargets' ==> 'nodeConfig.addTargets'
    var technologies = {
            inTechs : [ 'enb/techs/files', 'enb/techs/deps' ], // 'files' is always included
            inTargets : [],
            inJSON : []
        },
        inTechs = technologies.inTechs,
        inTargets = technologies.inTargets,
        inJSON = technologies.inJSON;

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
                inJSON.push('roole', 'enb-roole');
                break;
            case 'less':
                inTechs.push(getTechVal('less'));
                inJSON.push('less');
                break;
            case 'bemhtml.js':
                inTechs.push(base === 'bem-core' ? getTechVal('bemhtml.js') + '-old' : getTechVal('bemhtml.js').replace('bemxjst', 'xjst'));  // bem-core ==> bemhtml-old | bem-bl ==> bemhtml"
                inTargets.push(toMinify.indexOf('bemhtml.js') > -1 ? 'min.bemhtml.js' : 'bemhtml.js');   // 'bemhtml' ==> '?.bemhtml.js' in 'nodeConfig.addTargets'
                inJSON.push(base === 'bem-core' ? 'enb-bemxjst' : 'enb-xjst');
                break;
            case 'bh':
                inTechs.push(getTechVal('bh'));
                inTargets.push(toMinify.indexOf('bemhtml.js') > -1 ? 'min.bemhtml.js' : 'bemhtml.js');   // 'bh' ==> '?.bemhtml.js' in 'nodeConfig.addTargets'
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

exports.addPreprocessor = function(input, preprocessor) {
    preprocessor && input.push(preprocessor);

    return input;
}


exports.addIe = function(input) {
    var ie = /ie[0-9]{0,2}\.css/.exec(input);

    if (ie) {
        input.push('ie.css');
        input = _.uniq(input);
    }

    return input;
}

exports.getScripts = function(techs, toMin) {
    var scripts = [];

    techs.indexOf('css') > -1 && scripts.push({
        elem: 'css',
        url: toMin.indexOf('css') > -1 ? 'min.css' : 'css'
    });

    techs.indexOf('browser.js') > -1 && scripts.push({
        elem: 'js',
        url: toMin.indexOf('browser.js') > -1 ? 'min.browser.js' : 'browser.js'
    });

    techs.indexOf('js') > -1 && scripts.push({
        elem: 'js',
        url: toMin.indexOf('js') > -1 ? 'min.js' : 'js'
    });

    return scripts;

}
