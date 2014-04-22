module.exports = function(config) {

    config.nodes('*.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            [ require('enb/techs/file-provider'), { target: '?.bemjson.js' } ],
            [ require('enb/techs/files') ],
            [ require('enb/techs/deps') ],
            [ require('enb/techs/bemdecl-from-bemjson') ],
            [ require('enb/techs/css-ie') ],
            [ require('enb/techs/css-ie6') ],
            [ require('enb/techs/css-ie7') ],
            [ require('enb/techs/css-ie8') ],
            [ require('enb/techs/css-ie9') ],
            [ require('enb-bemxjst/techs/bemtree-old') ],
            [ require('enb-diverse-js/techs/node-js') ],
            [ require('enb-diverse-js/techs/browser-js'), { target: '?.js' } ],
            [ require('enb/techs/css') ],
            [ require('enb-bemxjst/techs/bemhtml-old') ],
            [ require('enb/techs/html-from-bemjson') ]
        ]);

        nodeConfig.addTargets([
            '?.min.css',
            '?.min.ie.css',
            '?.min.ie6.css',
            '?.min.ie7.css',
            '?.min.ie8.css',
            '?.min.ie9.css',
            '?.min.bemtree.js',
            '?.min.node.js',
            '?.min.js',
            '?.min.bemhtml.js',
            '?.html'
        ]);
    });

    config.nodes('desktop.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            [ require('enb/techs/levels'), { levels: getDesktops(config) } ]
        ]);
    });

    config.nodes('touch-pad.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            [ require('enb/techs/levels'), { levels: getTouchPads(config) } ]
        ]);
    });

    config.nodes('touch-phone.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            [ require('enb/techs/levels'), { levels: getTouchPhones(config) } ]
        ]);
    });

    config.mode('development', function(modeConfig) {
        config.nodes('*.bundles/*', function(nodeConfig) {
            nodeConfig.addTechs([
                [ require('enb/techs/file-copy'), { sourceTarget: '?.css', destTarget: '?.min.css' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.ie.css', destTarget: '?.min.ie.css' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.ie6.css', destTarget: '?.min.ie6.css' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.ie7.css', destTarget: '?.min.ie7.css' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.ie8.css', destTarget: '?.min.ie8.css' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.ie9.css', destTarget: '?.min.ie9.css' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.bemtree.js', destTarget: '?.min.bemtree.js' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.node.js', destTarget: '?.min.node.js' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.js', destTarget: '?.min.js' } ],
                [ require('enb/techs/file-copy'), { sourceTarget: '?.bemhtml.js', destTarget: '?.min.bemhtml.js' } ]
            ]);
        });
    });

    config.mode('production', function(modeConfig) {
        config.nodes('*.bundles/*', function(nodeConfig) {
            nodeConfig.addTechs([
                [ require('enb/techs/borschik'), { sourceTarget: '?.css', destTarget: '?.min.css' } ],
                [ require('enb/techs/borschik'), { sourceTarget: '?.ie.css', destTarget: '?.min.ie.css' } ],
                [ require('enb/techs/borschik'), { sourceTarget: '?.ie6.css', destTarget: '?.min.ie6.css' } ],
                [ require('enb/techs/borschik'), { sourceTarget: '?.ie7.css', destTarget: '?.min.ie7.css' } ],
                [ require('enb/techs/borschik'), { sourceTarget: '?.ie8.css', destTarget: '?.min.ie8.css' } ],
                [ require('enb/techs/borschik'), { sourceTarget: '?.ie9.css', destTarget: '?.min.ie9.css' } ],
                [ require('enb/techs/borschik'), { sourceTarget: '?.bemtree.js', destTarget: '?.min.bemtree.js' } ],
                [ require('enb/techs/borschik'), { sourceTarget: '?.node.js', destTarget: '?.min.node.js' } ],
                [ require('enb/techs/borschik'), { sourceTarget: '?.js', destTarget: '?.min.js' } ],
                [ require('enb/techs/borschik'), { sourceTarget: '?.bemhtml.js', destTarget: '?.min.bemhtml.js' } ]
            ]);
        });
    });

};

function getDesktops(config) {
    return [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/desktop.blocks', check: false },
        'common.blocks',
        'desktop.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}

function getTouchPads(config) {
    return [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/touch.blocks', check: false },
        'common.blocks',
        'touch.blocks',
        'touch-pad.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}

function getTouchPhones(config) {
    return [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/touch.blocks', check: false },
        'common.blocks',
        'touch.blocks',
        'touch-phone.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
