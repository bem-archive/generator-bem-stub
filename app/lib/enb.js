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

// receives, for example, pls['desktop', 'common'] and libs['bem-core'], returns platforms['bem-core/desktop.blocks', 'bem-core/common.blocks']
exports.getPlatforms = function(pls, libs) {
    var platforms = [];
    for (var lib in libs) {
        for (var platform in pls) {
            platforms.push(libs[lib].name + '/' + (libs[lib].name !== 'bem-bl' ?  pls[platform] + '.blocks' : 'blocks-' + pls[platform]));
        }
    }

    return platforms;
}

// handles selected technologies
exports.getTechnologies = function(configPath, techs, base) {
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

    Object.keys(techs).forEach(function(tech) {
        switch(techs[tech]) {
            case 'stylus':
                inTechs.push(getTechVal('stylus'));
                inTargets.push('css');  // 'stylus' ==> '?.css' in 'nodeConfig.addTargets'
                inJSON.push('enb-stylus');
                break;
            case 'roole':
                inTechs.push(getTechVal('roole'));
                inTargets.push('css');  // 'roole' ==> '?.css' in 'nodeConfig.addTargets'
                inJSON.push('roole', 'enb-roole');
                break;
            case 'less':
                inTechs.push(getTechVal('less'));
                inTargets.push('css');  // 'less' ==> '?.css' in 'nodeConfig.addTargets'
                inJSON.push('less');
                break;
            case 'bemhtml.js':
                inTechs.push(getTechVal('bemhtml') + (base === 'bem-core' ? '-old' : ''));  // bem-core ==> bemhtml-old | bem-bl ==> bemhtml"
                inTargets.push('bemhtml.js');   // 'bemhtml' ==> '?.bemhtml.js' in 'nodeConfig.addTargets'
                inJSON.push('enb-bemxjst');
                break;
            case 'bh':
                inTechs.push(getTechVal('bh'));
                inTargets.push('bemhtml.js');   // 'bh' ==> '?.bemhtml.js' in 'nodeConfig.addTargets'
                inJSON.push('bh');
                break;
            default:
                inTechs.push(getTechVal(techs[tech]));
                inTargets.push(techs[tech]);

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
    input.push(preprocessor);

    return input;
}


exports.addCssIe = function(input) {
    var ie = /ie[0-9]{0,2}\.css/.exec(input);

    if (ie) {
        input.push('ie.css');
        input = _.uniq(input);
    }

    return input;
}
