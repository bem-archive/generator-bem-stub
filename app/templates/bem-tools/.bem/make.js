/* global MAKE:false */

// process.env.YENV = 'production';

var PATH = require('path');<%= roole.require %>

MAKE.decl('Arch', {

    blocksLevelsRegexp : /^.+?\.blocks/,
    bundlesLevelsRegexp : /^.+?\.bundles$/

});


MAKE.decl('BundleNode', {

    getTechs: function() {

        return [
<%= _.map(technologies.inMake.techs, function(technology) { return "            '" + technology + "'"}).join(',\n') %>
        ];

    },

    getForkedTechs : function() {
        return this.__base().concat([<%= _.map(technologies.inMake.forked, function(tech) { return "'" + tech + "'" }).join(', ') %>]);
    },

    getLevelsMap : function() {
        return {
            <%= "'" + platforms.withoutPath[platforms.withoutPath.length - 1] + "'" %> : [
<%= _.map(platforms.withPath, function(platform) { return "                'libs/" + platform + "',"}).join('\n') %>
<%= _.map(platforms.withoutPath, function(platform) { return "                '" + platform + ".blocks'"}).join(',\n') %>
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
    }<%= roole.code %>

});<%= design %>
