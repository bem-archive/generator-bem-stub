/* global MAKE:false */

// process.env.YENV = 'production';

var PATH = require('path');<%= isAutoprefixer ? "\n\nrequire(\'bem-tools-autoprefixer\').extendMake(MAKE);" : "" %>

MAKE.decl('Arch', {

	blocksLevelsRegexp: /^.+?\.blocks/,
	bundlesLevelsRegexp: /^.+?\.bundles$/

});

MAKE.decl('BundleNode', {

	getTechs: function () {
		return [
<%= _.map(technologies.inMake.techs, function (technology) { return "\t\t\t'" + technology + "'" }).join(',\n') %>
		];
	},

	getForkedTechs: function () {
		return this.__base().concat([<%= _.map(technologies.inMake.forked, function (tech) { return "'" + tech + "'" }).join(', ') %>]);
	},

	getLevelsMap: function () {
		return {<%= (platforms.withoutPath['desktop'] ?

						"\n\t\t\tdesktop: [\n" +

						_.map(platforms.withPath['desktop'], function (platform) {
							return "\t\t\t\t'libs/" + platform + "',";
						}).join('\n') +

						"\n" +

						_.map(platforms.withoutPath['desktop'], function (platform) {
							return "\t\t\t\t'" + platform + ".blocks'";
						}).join(',\n') +

						"\n\t\t\t]" : "") +

					(platforms.withoutPath['touch-pad'] ?

						(platforms.withoutPath['desktop'] ? ",\n" : "\n") +

						"\t\t\t'touch-pad': [\n" +

						_.map(platforms.withPath['touch-pad'], function (platform) {
							return "\t\t\t\t'libs/" + platform + "',";
						}).join('\n') +

						"\n" +

						_.map(platforms.withoutPath['touch-pad'], function (platform) {
							return "\t\t\t\t'" + platform + ".blocks'";
						}).join(',\n') +

						"\n\t\t\t]" : "") +

					(platforms.withoutPath['touch-phone'] ?

						(platforms.withoutPath['desktop'] || platforms.withoutPath['touch-pad'] ? ",\n" : "\n") +

						"\t\t\t'touch-phone': [\n" +

						_.map(platforms.withPath['touch-phone'], function (platform) {
							return "\t\t\t\t'libs/" + platform + "',";
						}).join('\n') +

						"\n" +

						_.map(platforms.withoutPath['touch-phone'], function (platform) {
							return "\t\t\t\t'" + platform + ".blocks'";
						}).join(',\n') +

						"\n\t\t\t]" : "")
				%>
		};
	},

	getLevels: function () {
		var resolve = PATH.resolve.bind(PATH, this.root),
			buildLevel = this.getLevelPath().split('.')[0],
			levels = this.getLevelsMap()[buildLevel] || [];

		return levels
			.map(function (path) { return resolve(path); })
			.concat(resolve(PATH.dirname(this.getNodePrefix()), 'blocks'));
	}<%= isAutoprefixer ?

		",\n\n\t'create-css-node': function (tech, bundleNode, magicNode) {\n\t\tvar source = this.getBundlePath('" + preprocessor + "');\n\t\tif (this.ctx.arch.hasNode(source)) {\n\t\t\treturn this.createAutoprefixerNode(tech, this.ctx.arch.getNode(source), bundleNode, magicNode);\n\t\t}\n\t}"

	: "" %>

});<%= isAutoprefixer ?

		"\n\nMAKE.decl('AutoprefixerNode', {\n\n\tgetPlatform: function () {\n\t\treturn this.output.split('.')[0];\n\t},\n\n\tgetBrowsers: function () {\n\t\tvar platform = this.getPlatform();\n\t\tswitch (platform) {\n" +

		(platforms.withoutPath['desktop'] ?

			"\t\t\tcase 'desktop':\n\t\t\t\treturn [\n" +

			_.map(browsers['desktop'], function (browser) {
				return "\t\t\t\t\t'" + browser + "'";
			}).join(',\n') +

			"\n\t\t\t\t];\n" : "") +

		(platforms.withoutPath['touch-pad'] ?

			"\n\t\t\tcase 'touch-pad':\n\t\t\t\treturn [\n" +

			_.map(browsers['touch-pad'], function (browser) {
				return "\t\t\t\t\t'" + browser + "'";
			}).join(',\n') +

			"\n\t\t\t\t];\n" : "") +

		(platforms.withoutPath['touch-phone'] ?

			"\n\t\t\tcase 'touch-phone':\n\t\t\t\treturn [\n" +

			_.map(browsers['touch-phone'], function (browser) {
				return "\t\t\t\t\t'" + browser + "'";
			}).join(',\n') +

			"\n\t\t\t\t];\n" : "") +

		"\t\t}\n\n\t\treturn this.__base();\n\t}\n\n});"

	: "" %>
