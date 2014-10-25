var environ = require('bem-environ'),
    getTechResolver = environ.getTechResolver,

    BEMCORE_TECHS = environ.getLibPath('bem-core', '.bem/techs');

exports.baseLevelPath = require.resolve('./blocks');

exports.getTechs = function () {
    var techs = this.__base();

    // Use techs from lib bem-core
    [<%= _.map(technologies.inBundles, function (tech) { return "'" + tech + "'" }).join(', ') %>].forEach(getTechResolver(techs, BEMCORE_TECHS));

    return techs;
};

// Create bundles in bemjson.js tech
exports.defaultTechs = [<%= isBemjson ? "'bemjson.js'" : "'bemdecl.js'" %>];
