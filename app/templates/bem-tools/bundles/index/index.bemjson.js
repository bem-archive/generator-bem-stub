({
    block: 'page',
    title: 'Hello, World!',
    styles: [
<%= _.map(styles.css, function (style) { return "        { elem: '" + style.elem + "', url: '_index." + style.url + "' }" }).join(',\n') %><%=
    (styles.ies.length ? ",\n" + _.map(styles.ies, function (ie) {
        return "        '<!--[if IE" + (/[0-9]{1,2}/.exec(ie.url) ? " " + (/[0-9]{1,2}/.exec(ie.url)[0]) : "") + "]>',\n            { elem: '" +
            ie.elem + "', url: '_index." + ie.url + "' },\n        '<![endif]-->'"}).join(',\n') : "") %>
    ],
    scripts: [
<%= _.map(scripts, function (script) { return "        { elem: '" + script.elem + "', url: '_index." + script.url + "' }" }).join(',\n') %>
    ],
    content: [
        'Hello, World!'
    ]
});
