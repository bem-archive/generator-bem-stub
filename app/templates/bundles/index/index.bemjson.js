({
	block: 'page',
	title: 'Hello, World!',
	styles: [
<%= _.map(styles.css, function (style) { return "\t\t{ elem: '" + style.elem + "', url: '" + style.url + "' }" }).join(',\n') %><%=
	(styles.ies.length ? ",\n" + _.map(styles.ies, function (ie) {
		return "\t\t'<!--[if IE" + (/[0-9]{1,2}/.exec(ie.url) ? " " + (/[0-9]{1,2}/.exec(ie.url)[0]) : "") + "]>',\n\t\t\t{ elem: '" +
			ie.elem + "', url: '" + ie.url + "' },\n\t\t'<![endif]-->'"}).join(',\n') : "") %>
	],
	scripts: [
<%= _.map(scripts, function (script) { return "\t\t{ elem: '" + script.elem + "', url: '" + script.url + "' }" }).join(',\n') %>
	],
	content: [
		'Hello, World!'
	]
});
