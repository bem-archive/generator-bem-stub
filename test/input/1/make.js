/* jshint node:true */
/* global MAKE */

var environ = require('bem-environ')(__dirname);
environ.extendMake(MAKE);

//process.env.YENV = 'production';
//process.env.XJST_ASYNCIFY = 'yes';

MAKE.decl('Arch', {

    blocksLevelsRegexp: /^.+?\.blocks/,
    bundlesLevelsRegexp: /^.+?\.bundles$/,

    libraries: [
        'bem-core @ f4b46ef0590549042d938f7e981df4d14eb4caef'
    ]

});


MAKE.decl('BundleNode', {

    getTechs: function() {

        return [
            'bemdecl.js',
            'deps.js'
        ];

    },

    'create-browser.js+bemhtml-optimizer-node': function(tech, sourceNode, bundleNode) {
        sourceNode.getFiles().forEach(function(f) {
            this['create-js-optimizer-node'](tech, this.ctx.arch.getNode(f), bundleNode);
        }, this);
    }

});
