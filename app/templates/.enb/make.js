var enbBemTechs = require('enb-bem-techs'),<%= toMinify.length > 0 ? "\n\tborschikTech = require('enb-borschik/techs/borschik')," : "" %>
    isProd = process.env.YENV === 'production';

module.exports = function (config) {
    config.nodes('*.bundles/*', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [require('enb/techs/file-provider'), { target: <%= "'?." + (isBemjson ? 'bemjson.js' : 'bemdecl.js') + "'" %> }],
            [enbBemTechs.files],
            [enbBemTechs.deps],
<%= _.map(technologies.inTechs, function (technology) { return "\t\t\t" + technology }).join(',\n') %><%= toMinify.length > 0 ? ",\n\t\t\t// borschik\n" +
            _.map(toMinify, function (technology) {
                return "\t\t\t[borschikTech, { sourceTarget: '?." + technology + "', destTarget: '_?." + technology + "', " + (technology === 'css' ? "tech: 'cleancss', " : "") + "freeze: true, minify: isProd }]";
            }).join(',\n') : "" %>
        ]);

        nodeConfig.addTargets([
<%= _.map(technologies.inTargets, function (technology) { return "\t\t\t'" + technology + "'" }).join(',\n') %>
        ]);
    });<%= (platforms.withoutPath['desktop'] ?

                "\n\n\tconfig.nodes('*desktop.bundles/*', function (nodeConfig) {\n\t\tnodeConfig.addTechs([\n\t\t\t// essential\n\t\t\t[enbBemTechs.levels, { levels: getDesktops(config) }]" +

                (isAutoprefixer ?

                    ",\n\t\t\t// autoprefixer\n\t\t\t[require('enb-autoprefixer/techs/css-autoprefixer'), {\n\t\t\t\tbrowserSupport: [" +

                    _.map(browsers['desktop'], function (browser) {
                        return "'" + browser + "'";
                    }).join(', ') +

                    "],\n\t\t\t\tsourceTarget: '?.noprefix.css'\n\t\t\t}]"

                : "") +

                "\n\t\t]);\n\t});" : "") +

            (platforms.withoutPath['touch-pad'] ?

                "\n\n\tconfig.nodes('*touch-pad.bundles/*', function (nodeConfig) {\n\t\tnodeConfig.addTechs([\n\t\t\t// essential\n\t\t\t[enbBemTechs.levels, { levels: getTouchPads(config) }]" +

                (isAutoprefixer ?

                    ",\n\t\t\t// autoprefixer\n\t\t\t[require('enb-autoprefixer/techs/css-autoprefixer'), {\n\t\t\t\tbrowserSupport: [" +

                    _.map(browsers['touch-pad'], function (browser) {
                        return "'" + browser + "'";
                    }).join(', ') +

                    "],\n\t\t\t\tsourceTarget: '?.noprefix.css'\n\t\t\t}]"

                : "") +

                "\n\t\t]);\n\t});" : "") +

            (platforms.withoutPath['touch-phone'] ?

                "\n\n\tconfig.nodes('*touch-phone.bundles/*', function (nodeConfig) {\n\t\tnodeConfig.addTechs([\n\t\t\t// essential\n\t\t\t[enbBemTechs.levels, { levels: getTouchPhones(config) }]" +

                (isAutoprefixer ?

                    ",\n\t\t\t// autoprefixer\n\t\t\t[require('enb-autoprefixer/techs/css-autoprefixer'), {\n\t\t\t\tbrowserSupport: [" +

                    _.map(browsers['touch-phone'], function (browser) {
                        return "'" + browser + "'";
                    }).join(', ') +

                    "],\n\t\t\t\tsourceTarget: '?.noprefix.css'\n\t\t\t}]"

                : "") +

                "\n\t\t]);\n\t});" : "")
        %>

};<%= (platforms.withoutPath['desktop'] ?

        "\n\nfunction getDesktops(config) {\n\treturn [\n" +

        _.map(platforms.withPath['desktop'], function (platform) {
            return "\t\t{ path: 'libs/" + platform + "', check: false },";
        }).join('\n') +

        "\n" +

        _.map(platforms.withoutPath['desktop'], function (platform) {
            return "\t\t'" + platform + ".blocks'";
        }).join(',\n') +

        "\n\t].map(function (level) {\n\t\treturn config.resolvePath(level);\n\t});\n}" : "") +

    (platforms.withoutPath['touch-pad'] ?

        "\n\nfunction getTouchPads(config) {\n\treturn [\n" +

        _.map(platforms.withPath['touch-pad'], function (platform) {
            return "\t\t{ path: 'libs/" + platform + "', check: false },";
        }).join('\n') +

        "\n" +

        _.map(platforms.withoutPath['touch-pad'], function (platform) {
            return "\t\t'" + platform + ".blocks'";
        }).join(',\n') +

        "\n\t].map(function (level) {\n\t\treturn config.resolvePath(level);\n\t});\n}" : "") +

    (platforms.withoutPath['touch-phone'] ?

        "\n\nfunction getTouchPhones(config) {\n\treturn [\n" +

        _.map(platforms.withPath['touch-phone'], function (platform) {
            return "\t\t{ path: 'libs/" + platform + "', check: false },";
        }).join('\n') +

        "\n" +

        _.map(platforms.withoutPath['touch-phone'], function (platform) {
            return "\t\t'" + platform + ".blocks'";
        }).join(',\n') +

        "\n\t].map(function (level) {\n\t\treturn config.resolvePath(level);\n\t});\n}" : "")
    %>
