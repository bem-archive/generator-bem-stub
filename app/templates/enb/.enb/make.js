module.exports = function(config) {
    // Сборка общих технологий для всех бандлов
    config.nodes('*.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            [ require('enb/techs/file-provider'), { target: '?.bemdecl.js' } ],
            [ require('enb/techs/deps'), { bemdeclTarget: '?.bemdecl.js' } ],
<%= _.map(technologies.inTechs, function(technology) { return "            [ require('" + technology + "') ]"}).join(',\n') %>
        ]);

        nodeConfig.addTargets([
<%= _.map(technologies.inTargets, function(technology) { return "            '?." + technology + "'"}).join(',\n') %>
        ]);
    });

    // Указываем уровни для бандлов технологий
    config.nodes(<%= "'" + platforms.withoutPath[platforms.withoutPath.length - 1] + ".bundles/*'"%>, function(nodeConfig) {
        nodeConfig.addTechs([
            [ require('enb/techs/levels'), { levels: getLevels(config) } ]
        ]);
    });
};

/**
 * Получение уровней переопределения
 *
 * @param {Object} config
 * @returns {*|Array}
 */
function getLevels(config) {
    return [
<%= _.map(platforms.withPath, function(platform) { return "        { path: 'libs/" + platform + "', check: false },"}).join('\n') %>
<%= _.map(platforms.withoutPath, function(platform) { return "        '" + platform + ".blocks'"}).join(',\n') %>
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
