var fs = require('fs'),
    tools = require('../app/lib/tools'),
    enb = require('../app/lib/enb'),
    configPath = 'app/templates/config.json';

// bem-tools
// ---------------------------------------

describe('\'bem-tools\'', function () {

    it('getPlatforms --> without design', function () {

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

            design = false,

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getPlatforms.no.design.json', 'utf-8'));

        tools.getPlatforms(pls, libs, design).must.eql(output);
    });

    it('getPlatforms --> with design', function () {

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

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getPlatforms.design.json', 'utf-8'));

        tools.getPlatforms(pls, libs, design).must.eql(output);
    });

    it('addPreprocessor --> stylus', function () {

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

        preprocessor = 'stylus';

        output = [
            'bemjson.js',
            'stylus',
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

    it('addPreprocessor --> less', function () {

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

        preprocessor = 'less';

        output = [
            'bemjson.js',
            'less',
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

    it('addPreprocessor --> undefined', function () {

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

        preprocessor = undefined;

        output = [
            'bemjson.js',
            'stylus',
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

    it('getTechnologies --> bemjson.js', function () {

        var techs = [
            'bemjson.js',
            'css'
        ],

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getTechnologies.bemjson.json', 'utf-8'));

        tools.getTechnologies(configPath, techs).must.eql(output);
    });

    it('getTechnologies --> stylus', function () {

        var techs = [
            'stylus',
            'css'
        ],

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getTechnologies.stylus.json', 'utf-8'));

        tools.getTechnologies(configPath, techs).must.eql(output);
    });

    it('getTechnologies --> roole', function () {

        var techs = [
            'roole',
            'css'
        ],

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getTechnologies.roole.json', 'utf-8'));

        tools.getTechnologies(configPath, techs).must.eql(output);
    });

    it('getTechnologies --> less', function () {

        var techs = [
            'less',
            'css'
        ],

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getTechnologies.less.json', 'utf-8'));

        tools.getTechnologies(configPath, techs).must.eql(output);
    });

    it('getTechnologies --> css', function () {

        var techs = [
            'css'
        ],

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getTechnologies.css.json', 'utf-8'));

        tools.getTechnologies(configPath, techs).must.eql(output);
    });

    it('getTechnologies --> ie', function () {

        var techs = [
            'css',
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
        ],

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getTechnologies.ie.json', 'utf-8'));

        tools.getTechnologies(configPath, techs).must.eql(output);
    });

    it('getTechnologies --> bemtree', function () {

        var techs = [
            'css',
            'bemtree'
        ],

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getTechnologies.bemtree.json', 'utf-8'));

        tools.getTechnologies(configPath, techs).must.eql(output);
    });

    it('getTechnologies --> bemhtml', function () {

        var techs = [
            'css',
            'bemhtml'
        ],

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getTechnologies.bemhtml.json', 'utf-8'));

        tools.getTechnologies(configPath, techs).must.eql(output);
    });

    it('getTechnologies --> node.js', function () {

        var techs = [
            'css',
            'node.js'
        ],

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getTechnologies.node.json', 'utf-8'));

        tools.getTechnologies(configPath, techs).must.eql(output);
    });

    it('getTechnologies --> browser.js+bemhtml', function () {

        var techs = [
            'css',
            'browser.js+bemhtml'
        ],

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getTechnologies.browser.json', 'utf-8'));

        tools.getTechnologies(configPath, techs).must.eql(output);
    });

    it('getTechnologies --> html', function () {

        var techs = [
            'bemjson.js',
            'css',
            'bemhtml',
            'html'
        ],

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getTechnologies.html.json', 'utf-8'));

        tools.getTechnologies(configPath, techs).must.eql(output);
    });

    it('getTechnologies --> all', function () {

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

        output = JSON.parse(fs.readFileSync('test/fixtures/tools/getTechnologies.all.json', 'utf-8'));

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

// ---------------------------------------


// enb
// ---------------------------------------

describe('\'enb\'', function () {

    it('getPlatforms --> without design', function () {

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

            design = false,

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getPlatforms.no.design.json', 'utf-8'));

        enb.getPlatforms(pls, libs, design).must.eql(output);
    });

    it('getPlatforms --> with design', function () {

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

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getPlatforms.design.json', 'utf-8'));

        enb.getPlatforms(pls, libs, design).must.eql(output);
    });

    it('addPreprocessor --> stylus', function () {

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

        preprocessor = 'stylus';

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
            'stylus'
        ];

        enb.addPreprocessor(techs, preprocessor).must.eql(output);
    });

    it('addPreprocessor --> roole', function () {

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

    it('addPreprocessor --> less', function () {

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

        preprocessor = 'less';

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
            'less'
        ];

        enb.addPreprocessor(techs, preprocessor).must.eql(output);
    });

    it('addPreprocessor --> css', function () {

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

        preprocessor = 'css';

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
            'css'
        ];

        enb.addPreprocessor(techs, preprocessor).must.eql(output);
    });

    it('addPreprocessor --> undefined', function () {

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
            'stylus'
        ];

        enb.addPreprocessor(techs, preprocessor).must.eql(output);
    });

    it('getTechnologies --> bemjson.js', function () {

        var techs = [
            'bemjson.js',
            'css'
        ],

        toMinify = []

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.bemjson.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> stylus', function () {

        var techs = [
            'stylus'
        ],

        toMinify = []

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.stylus.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> roole', function () {

        var techs = [
            'roole'
        ],

        toMinify = []

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.roole.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> less', function () {

        var techs = [
            'less'
        ],

        toMinify = []

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.less.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> css', function () {

        var techs = [
            'css'
        ],

        toMinify = []

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.css.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> css minimized', function () {

        var techs = [
            'css'
        ],

        toMinify = [
            'css'
        ]

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.css.min.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> ie', function () {

        var techs = [
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'css'
        ],

        toMinify = []

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.ie.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> ie minimized', function () {

        var techs = [
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'css'
        ],

        toMinify = [
            'ie.css',
            'ie6.css',
            'ie7.css',
            'ie8.css',
            'ie9.css',
            'css'
        ]

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.ie.min.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> bemtree.js', function () {

        var techs = [
            'bemtree.js',
            'css'
        ],

        toMinify = []

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.bemtree.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> bemtree.js minimized', function () {

        var techs = [
            'bemtree.js',
            'css'
        ],

        toMinify = [
            'bemtree.js'
        ]

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.bemtree.min.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> node.js', function () {

        var techs = [
            'node.js',
            'css'
        ],

        toMinify = []

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.node.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> node.js minimized', function () {

        var techs = [
            'node.js',
            'css'
        ],

        toMinify = [
            'node.js'
        ]

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.node.min.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> browser.js', function () {

        var techs = [
            'browser.js',
            'css'
        ],

        toMinify = []

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.browser.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> browser.js minimized', function () {

        var techs = [
            'browser.js',
            'css'
        ],

        toMinify = [
            'js'
        ]

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.browser.min.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> bemhtml', function () {

        var techs = [
            'bemhtml',
            'css'
        ],

        toMinify = []

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.bemhtml.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> bemhtml minimized', function () {

        var techs = [
            'bemhtml',
            'css'
        ],

        toMinify = [
            'bemhtml.js'
        ]

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.bemhtml.min.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> bh', function () {

        var techs = [
            'bh',
            'css'
        ],

        toMinify = []

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.bh.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> bh minimized', function () {

        var techs = [
            'bh',
            'css'
        ],

        toMinify = [
            'bh.js'
        ]

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.bh.min.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> bemhtml + html', function () {

        var techs = [
            'bemjson.js',
            'css',
            'bemhtml',
            'html'
        ],

        toMinify = []

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.html.bemhtml.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('getTechnologies --> bh + html', function () {

        var techs = [
            'bemjson.js',
            'css',
            'bh',
            'html'
        ],

        toMinify = []

        output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.html.bh.json', 'utf-8'));

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
            'js'
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
            'min.js'
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

// ---------------------------------------
