var fs = require('fs'),
    tools = require('../app/lib/tools'),
    enb = require('../app/lib/enb'),
    configPath = 'app/templates/config.json';

function readFiles(f1, f2) {
    var files = {};

    files.html1 = fs.readFileSync('test/fixtures/' + f1, 'utf-8'),
    files.html2 = fs.readFileSync('test/fixtures/' + f2, 'utf-8');

    return files;
}

describe('\'bem-tools\'', function () {

    it('getPlatforms', function () {

        var pls = [
            [ 'common', 'desktop' ],
            [ 'common', 'touch', 'touch-pad' ],
            [ 'common', 'touch', 'touch-phone' ]
        ],
            libs = [{
                name: 'bem-core',
                version: ''
            }, {
                name: 'bem-components',
                version: ''
            }],

            design = true,

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getPlatforms.json', 'utf-8'));

        tools.getPlatforms(pls, libs, design).must.eql(output);
    });

    it('addPreprocessor --> roole', function () {

        var techs = [
            'bemjson.js',
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'bemtree',
            'bemhtml',
            'node.js',
            'browser.js+bemhtml'
        ],

        preprocessor = 'roole';

        output = [
            'bemjson.js',
            'roole',
            'css',
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'bemtree',
            'bemhtml',
            'node.js',
            'browser.js+bemhtml'
        ];

        tools.addPreprocessor(techs, preprocessor).must.eql(output);
    });

    it('addPreprocessor --> css', function () {

        var techs = [
            'bemjson.js',
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'bemtree',
            'bemhtml',
            'node.js',
            'browser.js+bemhtml'
        ],

        preprocessor = 'css';

        output = [
            'bemjson.js',
            'css',
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'bemtree',
            'bemhtml',
            'node.js',
            'browser.js+bemhtml'
        ];

        tools.addPreprocessor(techs, preprocessor).must.eql(output);
    });

    it('addIe', function () {

        var techs = [
            'bemjson.js',
            'roole',
            'css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'bemtree',
            'bemhtml',
            'node.js',
            'browser.js+bemhtml'
        ],

        output = [
            'bemjson.js',
            'roole',
            'css',
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'bemtree',
            'bemhtml',
            'node.js',
            'browser.js+bemhtml'
        ];

        tools.addIe(techs).must.eql(output);
    });


    it('!addIe', function () {

        var techs = [
            'bemjson.js',
            'roole',
            'css',
            'bemtree',
            'bemhtml',
            'node.js',
            'browser.js+bemhtml'
        ],

        output = [
            'bemjson.js',
            'roole',
            'css',
            'bemtree',
            'bemhtml',
            'node.js',
            'browser.js+bemhtml'
        ];

        tools.addIe(techs).must.eql(output);
    });

    it('getTechnologies', function () {

        var techs = [
            'bemjson.js',
            'roole',
            'css',
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'bemtree',
            'bemhtml',
            'node.js',
            'browser.js+bemhtml',
            'html'
        ],

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getTechnologies.json', 'utf-8'));

        tools.getTechnologies(configPath, techs).must.eql(output);
    });

    it('getBrowsers', function () {

        var platforms = {
            desktop: [
                'common',
                'desktop'
            ],
            'touch-pad': [
                'common',
                'touch',
                'touch-pad'
            ],
            'touch-phone': [
                'common',
                'touch',
                'touch-phone'
            ]
        },

        output = {
            desktop: [
                'last 2 versions',
                'ie 10',
                'ff 24',
                'opera 12.16'
            ],
            'touch-pad': [
                'android 4',
                'ios 5'
            ],
            'touch-phone': [
                'android 4',
                'ios 6',
                'ie 10'
            ]
        }

        tools.getBrowsers(configPath, platforms).must.eql(output);
    });

});

describe('\'enb\'', function () {

    it('getPlatforms', function () {

        var pls = [
            [ 'common', 'desktop' ],
            [ 'common', 'touch', 'touch-pad' ],
            [ 'common', 'touch', 'touch-phone' ]
        ],
            libs = [{
                name: 'bem-core',
                version: ''
            }, {
                name: 'bem-components',
                version: ''
            }],

            design = true,

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getPlatforms.json', 'utf-8'));

        enb.getPlatforms(pls, libs, design).must.eql(output);
    });

    it('addPreprocessor', function () {

        var techs = [
            'bemjson.js',
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'bemtree.js',
            'node.js',
            'browser.js'
        ],

        preprocessor = 'roole';

        output = [
            'bemjson.js',
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'bemtree.js',
            'node.js',
            'browser.js',
            'roole'
        ];

        enb.addPreprocessor(techs, preprocessor).must.eql(output);
    });

    it('addPreprocessor --> design', function () {

        var techs = [
            'bemjson.js',
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'bemtree.js',
            'node.js',
            'browser.js'
        ],

        preprocessor = undefined;

        output = [
            'bemjson.js',
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'bemtree.js',
            'node.js',
            'browser.js',
            'design-roole'
        ];

        enb.addPreprocessor(techs, preprocessor).must.eql(output);
    });

    it('getTechnologies', function () {

        var techs = [
            'bemjson.js',
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'bemtree.js',
            'node.js',
            'browser.js',
            'design-roole',
            'bemhtml.js',
            'html'
        ],

        toMinify = [
            'css',
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'bemtree.js',
            'node.js',
            'js',
            'bemhtml.js'
        ]

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getBrowsers', function () {

        var platforms = {
                desktop: [
                    'common',
                    'desktop'
                ],
                'touch-pad': [
                    'common',
                    'touch',
                    'touch-pad'
                ],
                'touch-phone': [
                    'common',
                    'touch',
                    'touch-phone'
                ]
        },

        output = {
            desktop: [
                'last 2 versions',
                'ie 10',
                'ff 24',
                'opera 12.16'
            ],
            'touch-pad': [
                'android 4',
                'ios 5'
            ],
            'touch-phone': [
                'android 4',
                'ios 6',
                'ie 10'
            ]
        };

        enb.getBrowsers(configPath, platforms).must.eql(output);
    });

    it('getScripts', function () {

        var techs = [
            'css',
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'bemtree.js',
            'node.js',
            'js',
            'bemhtml.js',
            'html'
        ],

        output = {
            cssJS: [{
                elem: 'css',
                url: 'css'
            }, {
                elem: 'js',
                url: 'js'
            }],

            ie: ['', 6, 7, 8, 9].map(function(i) {
                return {
                    elem: 'css',
                    url: 'ie' + i + '.css'
                };
            })
        }

        enb.getScripts(techs).must.eql(output);
    });

    it('getScripts --> minimized', function () {

        var techs = [
            'min.css',
            'min.ie.css',
            'min.ie6.css',
            'min.ie7.css',
            'min.ie8.css',
            'min.ie9.css',
            'min.bemtree.js',
            'min.node.js',
            'min.js',
            'min.bemhtml.js',
            'html'
        ],

        output = {
            cssJS: [{
                elem: 'css',
                url: 'min.css'
            }, {
                elem: 'js',
                url: 'min.js'
            }],

            ie: ['', 6, 7, 8, 9].map(function(i) {
                return {
                    elem: 'css',
                    url: 'min.ie' + i + '.css'
                };
            })
        }

        enb.getScripts(techs).must.eql(output);
    });

});
