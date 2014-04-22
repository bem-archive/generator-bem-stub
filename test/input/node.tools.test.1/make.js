/* global MAKE:false */

// process.env.YENV = 'production';

var PATH = require('path');

MAKE.decl('Arch', {

    blocksLevelsRegexp : /^.+?\.blocks/,
    bundlesLevelsRegexp : /^.+?\.bundles$/

});


MAKE.decl('BundleNode', {

    getTechs: function() {

        return [
            'bemjson.js',
            'bemdecl.js',
            'deps.js',
            'css',
            'node.js'
        ];

    },

    getForkedTechs : function() {
        return this.__base().concat([]);
    },

    getLevelsMap : function() {
        return {
            desktop: [
                'libs/bem-core/common.blocks',
                'libs/bem-core/desktop.blocks',
                'common.blocks',
                'desktop.blocks'
            ],
            'touch-pad': [
                'libs/bem-core/common.blocks',
                'libs/bem-core/touch.blocks',
                'libs/bem-core/touch-pad.blocks',
                'common.blocks',
                'touch.blocks',
                'touch-pad.blocks'
            ],
            'touch-phone': [
                'libs/bem-core/common.blocks',
                'libs/bem-core/touch.blocks',
                'libs/bem-core/touch-phone.blocks',
                'common.blocks',
                'touch.blocks',
                'touch-phone.blocks'
            ]
        };
    },

    getLevels : function() {
        var resolve = PATH.resolve.bind(PATH, this.root),
            buildLevel = this.getLevelPath().split('.')[0],
            levels = this.getLevelsMap()[buildLevel] || [];

        return levels
            .map(function(path) { return resolve(path); })
            .concat(resolve(PATH.dirname(this.getNodePrefix()), 'blocks'));
    }

});
