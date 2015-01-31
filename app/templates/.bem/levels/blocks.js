var PATH = require('path'),
	environ = require('bem-environ'),
	getTechResolver = environ.getTechResolver,

	PRJ_ROOT = environ.PRJ_ROOT,
	PRJ_TECHS = PATH.resolve(PRJ_ROOT, '.bem/techs'),
	BEMCORE_TECHS = environ.getLibPath('bem-core', '.bem/techs');

exports.getTechs = function () {
	var techs = {
<%= _.map(technologies.inBlocks.V2, function (tech) { return "\t\t" + tech }).join(',\n') %>
	};

	// use techs from project (.bem/techs)
	[<%= isBemjson ? "'bemjson.js'" : "" %>].forEach(getTechResolver(techs, PRJ_TECHS));

	// use techs from bem-core library
	[<%= _.map(technologies.inBlocks.notV2, function (tech) { return "'" + tech + "'" }).join(', ') %>].forEach(getTechResolver(techs, BEMCORE_TECHS));

	return techs;
};

exports.defaultTechs = [<%= _.map(technologies.inBlocks.defaultTechs, function (tech) { return "'" + tech + "'" }).join(', ') %>];
