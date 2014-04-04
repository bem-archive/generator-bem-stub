({
    block: '<%= page %>',
    title: 'Hello, World!',
    head: [
<%= _.map(scripts, function(script) { return "        { elem: '" + script.elem + "', url: 'index." + script.url + "' }"}).join(',\n') %>
    ],
    content: [
        'Hello, World!'
    ]
})