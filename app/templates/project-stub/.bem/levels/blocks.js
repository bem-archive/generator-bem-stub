var PATH = require('path'),
    environ = require('bem-environ'),
    join = PATH.join,

    PRJ_ROOT = environ.PRJ_ROOT,
    PRJ_TECHS = join(PRJ_ROOT, '.bem/techs'),
    BEMCORE_TECHS = environ.getLibPath('bem-core', '.bem/techs');

exports.getTechs = function() {

    return {
<%= _.map(technologies.inLevels, function(technology) { return "        " + technology}).join(',\n') %>
    };

};

exports.defaultTechs = ['css', 'browser.js', 'bemhtml'];
