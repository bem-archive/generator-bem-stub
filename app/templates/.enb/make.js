var enbBemTechs = require('enb-bem-techs')<% if (toMinify.length) { %>,
	borschikTech = require('enb-borschik/techs/borschik'); <% } else { %>;<% } %>

module.exports = function (config) {
	var isProd = process.env.YENV === 'production';

    config.nodes('*.bundles/*', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [require('enb/techs/file-provider'), { target:<% if (isBemjson) { %> '?.bemjson.js' <% } else { %> 'bemdecl.js' <% } %>}],
            [enbBemTechs.files],
            [enbBemTechs.deps]<% if (isBemjson) { %>,
            [enbBemTechs.bemjsonToBemdecl]<% } %><% if (technologies.inTechs['css'] && !isAutoprefixer) { %>,
            [require('enb/techs/css')]<% } else if (technologies.inTechs['css'] && isAutoprefixer) { %>,
            // css
            [require('enb/techs/css'), { target: '?.noprefix.css' }] <% } %><% if (technologies.inTechs['ie.css']) { %>,
            // ie.css
            [require('enb/techs/css'), {
                target: '?.ie.css',
                sourceSuffixes: ['css', 'ie.css']
            }]<% } %><% if (technologies.inTechs['ie8.css']) { %>,
            // ie8.css
            [require('enb/techs/css'), {
                target: '?.ie8.css',
                sourceSuffixes: ['css', 'ie8.css']
            }]<% } %><% if (technologies.inTechs['ie9.css']) { %>,
            // ie9.css
            [require('enb/techs/css'), {
                target: '?.ie9.css',
                sourceSuffixes: ['css', 'ie9.css']
            }]<% } %><% if (technologies.inTechs['bemtree']) { %>,
            // bemtree
            [require('enb-bemxjst/techs/bemtree'), {
                devMode: process.env.BEMTREE_ENV === 'development',
                compact: true
            }]<% } %><% if (technologies.inTechs['node.js']) { %>,
            // node.js
            [require('enb-js/techs/node-js'), { target: '?.pre.node.js' }],
            [require('enb-modules/techs/prepend-modules'), {
                source: '?.pre.node.js',
                target: '?.node.js'
            }]<% } %><% if (technologies.inTechs['browser.js']) { %>,
            // browser.js
            [require('enb-js/techs/browser-js'), { target: '?.browser.js' }],
            [require('enb/techs/file-merge'), {
                target: '?.pre.js',
                sources: ['?.browser.<%=technologies.inTechs["bemhtml"] ? "bemhtml" : "bh"%>.js', '?.browser.js']
            }],
            [require('enb-modules/techs/prepend-modules'), {
                source: '?.pre.js',
                target: '?.js'
            }]<% } %><% if (technologies.inTechs['bemhtml']) { %>,
            // bemhtml
            [require('enb-bemxjst/techs/bemhtml'), {
                devMode: process.env.BEMHTML_ENV === 'development',
                compact: true
            }]<% } %><% if (technologies.inTechs['bemhtml'] && technologies.inTechs['browser.js']) { %>,
            // client bemhtml
            [enbBemTechs.depsByTechToBemdecl, {
                target: '?.bemhtml.bemdecl.js',
                sourceTech: 'js',
                destTech: 'bemhtml'
            }],
            [enbBemTechs.deps, {
                target: '?.bemhtml.deps.js',
                bemdeclFile: '?.bemhtml.bemdecl.js'
            }],
            [enbBemTechs.files, {
                depsFile: '?.bemhtml.deps.js',
                filesTarget: '?.bemhtml.files',
                dirsTarget: '?.bemhtml.dirs'
            }],
            [require('enb-bemxjst/techs/bemhtml'), {
                target: '?.browser.bemhtml.js',
                filesTarget: '?.bemhtml.files',
                devMode: process.env.BEMHTML_ENV === 'development',
                compact: true
            }]<% } %><% if (technologies.inTechs['bh']) { %>,
            // bh
            [require('enb-bh/techs/bh-commonjs'), {
                bhOptions: {
                    jsAttrName: 'data-bem',
                    jsAttrScheme: 'json'
                }
            }]<% } %><% if (technologies.inTechs['bh'] && technologies.inTechs['browser.js']) { %>,
            // client bh
            [enbBemTechs.depsByTechToBemdecl, {
                target: '?.bh.bemdecl.js',
                sourceTech: 'js',
                destTech: 'bemhtml'
            }],
            [enbBemTechs.deps, {
                target: '?.bh.deps.js',
                bemdeclFile: '?.bh.bemdecl.js'
            }],
            [enbBemTechs.files, {
                depsFile: '?.bh.deps.js',
                filesTarget: '?.bh.files',
                dirsTarget: '?.bh.dirs'
            }],
            [require('enb-bh/techs/bh-bundle'), {
                target: '?.browser.bh.js',
                filesTarget: '?.bh.files',
                bhOptions: {
                    jsAttrName: 'data-bem',
                    jsAttrScheme: 'json',
                },
                mimic: 'BEMHTML'
            }]<% } %><% if (technologies.inTechs['html'] && technologies.inTechs['bemhtml']) { %>,
            // html
            [require('enb-bemxjst/techs/bemjson-to-html')]<% } else if (technologies.inTechs['html'] && technologies.inTechs['bh']) { %>,
            // html
            [require('enb-bh/techs/bemjson-to-html')]<% } %><% if (technologies.inTechs['tidy.html']) { %>,
            // tidy html
            [require('enb-beautify/techs/enb-beautify-html'), {
                htmlFileTarget: '?.html',
                destTarget: '?.tidy.html'
            }]<% } %><%= toMinify.length > 0 ? ",\n\t\t\t// borschik\n\t\t\t" +
            	_.map(toMinify, function (technology) {
                	return "[borschikTech, { sourceTarget: '?." + technology +
                		"', destTarget: '?.min." + technology + "', " +
                			(technology === 'css' ? "tech: 'cleancss', " : "") + "freeze: true, minify: isProd }]";
           		}).join(',\n\t\t\t') : ""
           	%>
        ]);

        nodeConfig.addTargets([
			<%= _.map(technologies.inTargets, function (technology) {
				return "'" + technology + "'"
			}).join(',\n\t\t\t') %>
        ]);
    });
	<% for (var projectLevel in levels.projectLevels) { %>
	config.nodes('<%= "*" + projectLevel + ".bundles/*" %>', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, {
                levels: [
                    <%= formatLevels(levels, projectLevel) %>
                ]
            }]<% if (technologies.inTechs['stylus']) { %>,
            // css
            [require('enb-stylus/techs/stylus'), {
                target: '?.css'<%if (isAutoprefixer) { %>,
                autoprefixer: {
                    browsers: [<%= formatBrowsers(browsers, projectLevel) %>]
                }<% } %>
            }]<% } else if (technologies.inTechs['css'] && isAutoprefixer) { %>,
            // autoprefixer
            [require('enb-autoprefixer/techs/css-autoprefixer'), {
                browserSupport: [<%= formatBrowsers(browsers, projectLevel) %>],
                sourceTarget: '?.noprefix.css'
            }]<% } %>
        ]);
    });<% } %>
};
<%
function formatBrowsers(browsers, level) {
    return _.map(browsers[level], function(browser) {
        return "'" + browser + "'";
    }).join(', ');
}
%>
<%
function formatLevels(levels, projectLevel) {
    return _(levels)
        .map(function(lvls, type) {
            if(type === 'libsLevels') {
                return _.map(lvls[projectLevel], function(pl) {
                    return "{ path: 'libs/" + pl + "', check: false }";
                });
            }

            return _.map(lvls[projectLevel], function(pl) {
                return "'" + pl + ".blocks'";
            });
        })
        .flatten()
        .value()
        .join(',\n\t\t\t\t\t');
}
%>
