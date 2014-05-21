({
    block: 'page',
    title: 'Hello, World!',
    head: [
<%= _.map(scripts.css_js, function(script) { return "        { elem: '" + script.elem + "', url: 'index." + script.url + "' }" }).join(',\n') %><%=
    (scripts.ie.length ? ",\n" + _.map(scripts.ie, function(script) {
        return "        '<!--[if IE" + (/[0-9]{1,2}/.exec(script.url) ? " " + (/[0-9]{1,2}/.exec(script.url)[0]) : "") + "]>',\n            { elem : '" +
            script.elem + "', url : 'index." + script.url + "' },\n        '<![endif]-->'"}).join(',\n') : "") %>
    ],
    content: [
        'Hello, World!'
    ]
})
