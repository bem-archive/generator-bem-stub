module.exports = function(config) {

    config.nodes('*.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([<%= design %>
            [ require('enb/techs/file-provider'), { target: <%= "'?." + target + "'" %> } ],
<%= _.map(technologies.inTechs, function(technology) { return "            [ require('" + technology + "') ]"}).join(',\n') %>
        ]);

        nodeConfig.addTargets([
<%= _.map(technologies.inTargets, function(technology) { return "            '?." + technology + "'"}).join(',\n') %>
        ]);
    });


    config.nodes(<%= "'" + platforms.withoutPath[platforms.withoutPath.length - 1] + ".bundles/*'"%>, function(nodeConfig) {
        nodeConfig.addTechs([
            [ require('enb/techs/levels'), { levels: getLevels(config) } ]
        ]);
    });


    config.mode('development', function(modeConfig) {
        config.nodes('*.bundles/*', function(nodeConfig) {
            nodeConfig.addTechs([
<%= _.map(toMinify, function(technology) { return "                [ require('enb/techs/file-copy'), { sourceTarget: '?." + technology + "', destTarget: '?.min." + technology + "' } ]" }).join(',\n') %>
            ]);
        });
    });

    config.mode('production', function(modeConfig) {
        config.nodes('*.bundles/*', function(nodeConfig) {
            nodeConfig.addTechs([
<%= _.map(toMinify, function(technology) { return "                [ require('enb/techs/borschik'), { sourceTarget: '?." + technology + "', destTarget: '?.min." + technology + "' } ]" }).join(',\n') %>
            ]);
        });
    });

};


function getLevels(config) {
    return [
<%= _.map(platforms.withPath, function(platform) { return "        { path: 'libs/" + platform + "', check: false },"}).join('\n') %>
<%= _.map(platforms.withoutPath, function(platform) { return "        '" + platform + ".blocks'"}).join(',\n') %>
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
