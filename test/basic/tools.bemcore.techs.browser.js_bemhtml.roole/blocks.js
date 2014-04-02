var PATH = require('path'),
    environ = require('bem-environ'),
    join = PATH.join,

    PRJ_ROOT = environ.PRJ_ROOT,
    PRJ_TECHS = join(PRJ_ROOT, '.bem/techs'),
    BEMCORE_TECHS = environ.getLibPath('bem-core', '.bem/techs');
    BEMBL_TECHS = environ.getLibPath('bem-bl', 'blocks-common/i-bem/bem/techs/v2');

exports.getTechs = function() {

    return {
        'bemdecl.js'           : 'v2/bemdecl.js',
        'deps.js'              : 'v2/deps.js',
        'roole'                : 'v2/roole',
        'browser.js+bemhtml'   : join(BEMCORE_TECHS, 'browser.js+bemhtml.js'),
        'browser.js'           : join(BEMCORE_TECHS, 'browser.js.js'),
        'vanilla.js'           : join(BEMCORE_TECHS, 'vanilla.js.js'),
        'js'                   : 'v2/js-i'
    };

};

exports.defaultTechs = ['css', 'browser.js', 'bemhtml'];
