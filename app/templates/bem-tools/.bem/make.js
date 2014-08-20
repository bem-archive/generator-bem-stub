/* global MAKE:false */

// process.env.YENV = 'production';

var PATH = require('path');<%= isPreprocessor ? "\n\nrequire(\'bem-tools-autoprefixer\').extendMake(MAKE);" : "" %>

MAKE.decl('Arch', {

    blocksLevelsRegexp : /^.+?\.blocks/,
    bundlesLevelsRegexp : /^.+?\.bundles$/

});


MAKE.decl('BundleNode', {

    getTechs: function() {

        return [
<%= _.map(technologies.inMake.techs, function(technology) { return "            '" + technology + "'" }).join(',\n') %>
        ];

    },

    getForkedTechs : function() {
        return this.__base().concat([<%= _.map(technologies.inMake.forked, function(tech) { return "'" + tech + "'" }).join(', ') %>]);
    },

    getLevelsMap : function() {
        return {<%= (platforms.withoutPath['desktop'] ?

                        "\n            desktop: [\n" +

                        _.map(platforms.withPath['desktop'], function(platform) {
                            return "                'libs/" + platform + "',";
                        }).join('\n') +

                        "\n" +

                        _.map(platforms.withoutPath['desktop'], function(platform) {
                            return "                '" + platform + ".blocks'";
                        }).join(',\n') +

                        "\n            ]" : "") +

                    (platforms.withoutPath['touch-pad'] ?

                        (platforms.withoutPath['desktop'] ? ",\n" : "\n") +

                        "            'touch-pad': [\n" +

                        _.map(platforms.withPath['touch-pad'], function(platform) {
                            return "                'libs/" + platform + "',";
                        }).join('\n') +

                        "\n" +

                        _.map(platforms.withoutPath['touch-pad'], function(platform) {
                            return "                '" + platform + ".blocks'";
                        }).join(',\n') +

                        "\n            ]" : "") +

                    (platforms.withoutPath['touch-phone'] ?

                        (platforms.withoutPath['desktop'] || platforms.withoutPath['touch-pad'] ? ",\n" : "\n") +

                        "            'touch-phone': [\n" +

                        _.map(platforms.withPath['touch-phone'], function(platform) {
                            return "                'libs/" + platform + "',";
                        }).join('\n') +

                        "\n" +

                        _.map(platforms.withoutPath['touch-phone'], function(platform) {
                            return "                '" + platform + ".blocks'";
                        }).join(',\n') +

                        "\n            ]" : "")
                %>
        };
    },

    getLevels : function() {
        var resolve = PATH.resolve.bind(PATH, this.root),
            buildLevel = this.getLevelPath().split('.')[0],
            levels = this.getLevelsMap()[buildLevel] || [];

        return levels
            .map(function(path) { return resolve(path); })
            .concat(resolve(PATH.dirname(this.getNodePrefix()), 'blocks'));
    }<%= isPreprocessor ?

        ",\n\n    'create-css-node' : function(tech, bundleNode, magicNode) {\n        var source = this.getBundlePath('" + preprocessor + "');\n        if(this.ctx.arch.hasNode(source)) {\n            return this.createAutoprefixerNode(tech, this.ctx.arch.getNode(source), bundleNode, magicNode);\n        }\n    }"

    : "" %>

});<%= design ?

        "\n\nMAKE.decl('AutoprefixerNode', {\n\n    getPlatform : function() {\n        return this.output.split('.')[0];\n    },\n\n    getBrowsers : function() {\n        var platform = this.getPlatform();\n        switch(platform) {\n" +

        (platforms.withoutPath['desktop'] ?

            "\n        case 'desktop':\n            return [\n" +

            _.map(browsers['desktop'], function(browser) {
                return "                '" + browser + "'";
            }).join(',\n') +

            "\n            ];\n" : "") +

        (platforms.withoutPath['touch-pad'] ?

            "\n        case 'touch-pad':\n            return [\n" +

            _.map(browsers['touch-pad'], function(browser) {
                return "                '" + browser + "'";
            }).join(',\n') +

            "\n            ];\n" : "") +

        (platforms.withoutPath['touch-phone'] ?

            "\n        case 'touch-phone':\n            return [\n" +

            _.map(browsers['touch-phone'], function(browser) {
                return "                '" + browser + "'";
            }).join(',\n') +

            "\n            ];\n" : "") +

        "\n        }\n\n        return this.__base();\n    }\n\n});"

    : "" %>
