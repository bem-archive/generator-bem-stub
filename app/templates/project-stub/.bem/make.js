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
<%= _.map(libs, function(lib) { return "        '" + lib.name + " @ " + lib.version + "'"}).join(',\n') %>
    ]

});


MAKE.decl('BundleNode', {

    getTechs: function() {

        return [
<%= _.map(technologies.inMake, function(technology) { return "            '" + technology + "'"}).join(',\n') %>
        ];

    },

    'create-browser.js+bemhtml-optimizer-node': function(tech, sourceNode, bundleNode) {
        sourceNode.getFiles().forEach(function(f) {
            this['create-js-optimizer-node'](tech, this.ctx.arch.getNode(f), bundleNode);
        }, this);
    }

});
