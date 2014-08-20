module.exports = function(config) {

    config.nodes('*.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            [ require('enb/techs/file-provider'), { target: <%= "'?." + (isBemjson ? 'bemjson.js' : 'bemdecl.js') + "'" %> } ],
<%= _.map(technologies.inTechs, function(technology) { return "            [ " + technology + " ]" }).join(',\n') %>
        ]);

        nodeConfig.addTargets([
<%= _.map(technologies.inTargets, function(technology) { return "            '?." + technology + "'" }).join(',\n') %>
        ]);
    });<%= (platforms.withoutPath['desktop'] ?

                "\n\n    config.nodes('*desktop.bundles/*', function(nodeConfig) {\n        nodeConfig.addTechs([\n            [ require('enb/techs/levels'), { levels: getDesktops(config) } ]" +

                (isPreprocessor ?

                    ",\n            [ require('enb-autoprefixer/techs/css-autoprefixer'), {\n                browserSupport: [ " +

                    _.map(browsers['desktop'], function(browser) {
                        return "'" + browser + "'";
                    }).join(', ')

                    + " ],\n                sourceTarget: '?.noprefix.css'\n            }]"

                : "") +

                "\n        ]);\n    });" : "") +

            (platforms.withoutPath['touch-pad'] ?

                "\n\n    config.nodes('*touch-pad.bundles/*', function(nodeConfig) {\n        nodeConfig.addTechs([\n            [ require('enb/techs/levels'), { levels: getTouchPads(config) } ]" +

                (isPreprocessor ?

                    ",\n            [ require('enb-autoprefixer/techs/css-autoprefixer'), {\n                browserSupport: [ " +

                    _.map(browsers['touch-pad'], function(browser) {
                        return "'" + browser + "'";
                    }).join(', ') +

                    " ],\n                sourceTarget: '?.noprefix.css'\n            }]"

                : "") +

                "\n        ]);\n    });" : "") +

            (platforms.withoutPath['touch-phone'] ?

                "\n\n    config.nodes('*touch-phone.bundles/*', function(nodeConfig) {\n        nodeConfig.addTechs([\n            [ require('enb/techs/levels'), { levels: getTouchPhones(config) } ]" +

                (isPreprocessor ?

                    ",\n            [ require('enb-autoprefixer/techs/css-autoprefixer'), {\n                browserSupport: [ " +

                    _.map(browsers['touch-phone'], function(browser) {
                        return "'" + browser + "'";
                    }).join(', ') +

                    " ],\n                sourceTarget: '?.noprefix.css'\n            }]"

                : "") +

                "\n        ]);\n    });" : "")
        %>
<%= toMinify.length > 0 ?

        "\n    config.mode('development', function(modeConfig) {\n        config.nodes('*.bundles/*', function(nodeConfig) {\n            nodeConfig.addTechs([\n" +

        _.map(toMinify, function(technology) {
            return "                [ require('enb/techs/file-copy'), { sourceTarget: '?." + technology + "', destTarget: '?.min." + technology + "' } ]";
        }).join(',\n') +

        "\n            ]);\n        });\n    });\n\n    config.mode('production', function(modeConfig) {\n        config.nodes('*.bundles/*', function(nodeConfig) {\n            nodeConfig.addTechs([\n" +

        _.map(toMinify, function(technology) {
            return "                [ require('enb/techs/borschik'), { sourceTarget: '?." + technology + "', destTarget: '?.min." + technology + "' } ]";
        }).join(',\n') +

        "\n            ]);\n        });\n    });\n" : ""
%>
};<%= (platforms.withoutPath['desktop'] ?

        "\n\nfunction getDesktops(config) {\n    return [\n" +

        _.map(platforms.withPath['desktop'], function(platform) {
            return "        { path: 'libs/" + platform + "', check: false },";
        }).join('\n') +

        "\n" +

        _.map(platforms.withoutPath['desktop'], function(platform) {
            return "        '" + platform + ".blocks'";
        }).join(',\n') +

        "\n    ].map(function(level) {\n        return config.resolvePath(level);\n    });\n}" : "") +

    (platforms.withoutPath['touch-pad'] ?

        "\n\nfunction getTouchPads(config) {\n    return [\n" +

        _.map(platforms.withPath['touch-pad'], function(platform) {
            return "        { path: 'libs/" + platform + "', check: false },";
        }).join('\n') +

        "\n" +

        _.map(platforms.withoutPath['touch-pad'], function(platform) {
            return "        '" + platform + ".blocks'";
        }).join(',\n') +

        "\n    ].map(function(level) {\n        return config.resolvePath(level);\n    });\n}" : "") +

    (platforms.withoutPath['touch-phone'] ?

        "\n\nfunction getTouchPhones(config) {\n    return [\n" +

        _.map(platforms.withPath['touch-phone'], function(platform) {
            return "        { path: 'libs/" + platform + "', check: false },";
        }).join('\n') +

        "\n" +

        _.map(platforms.withoutPath['touch-phone'], function(platform) {
            return "        '" + platform + ".blocks'";
        }).join(',\n') +

        "\n    ].map(function(level) {\n        return config.resolvePath(level);\n    });\n}" : "")
    %>
