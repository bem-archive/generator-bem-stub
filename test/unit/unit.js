var enb = require('../../app/lib/enb'),
    bemTools = require('../../app/lib/bem-tools'),
    config = {
        versions: require('./mocks/versions'),
        techs: require('./mocks/techs'),
        browsers: require('./mocks/browsers')
    };

// ENB
// ---------------------------------------
describe('\'ENB\'', function () {
    it('must get all platforms without design', function () {
        var pls = [
                ['common', 'desktop'],
                ['common', 'touch', 'touch-pad'],
                ['common', 'touch', 'touch-phone']
            ],
            libs = [
                { name: 'bem-core', version: '' },
                { name: 'bem-components', version: '' }
            ],
            output = require('./fixtures/enb/getPlatforms.no.design.json');

        enb.getPlatforms(pls, libs, false).must.eql(output);
    });

    it('must get all platforms with design', function () {
        var pls = [
                ['common', 'desktop'],
                ['common', 'touch', 'touch-pad'],
                ['common', 'touch', 'touch-phone']
            ],
            libs = [
                { name: 'bem-core', version: '' },
                { name: 'bem-components', version: '' }
            ],
            output = require('./fixtures/enb/getPlatforms.design.json');

        enb.getPlatforms(pls, libs, true).must.eql(output);
    });

    it('must add preprocessor', function () {
        enb.addPreprocessor([], 'stylus').must.eql(['stylus']);
    });

    it('must add preprocessor \'stylus\' as default', function () {
        enb.addPreprocessor([], undefined).must.eql(['stylus']);
    });

    it('must add template engine', function () {
        enb.addTemplateEngine(['css'], 'bh').must.eql(['css', 'bh']);
    });

    it('must not add template engine', function () {
        enb.addTemplateEngine(['css'], 'my').must.eql(['css']);
    });

    it('must get technology \'bemjson.js\'', function () {
        var output = require('./fixtures/enb/getTechnologies.bemjson.json');

        enb.getTechnologies(config, ['bemjson.js', 'css'], false, []).must.eql(output);
    });

    it('must get technology \'stylus\'', function () {
        var output = require('./fixtures/enb/getTechnologies.stylus.json');

        enb.getTechnologies(config, ['stylus'], false, []).must.eql(output);
    });

    it('must get technology \'stylus\' + \'autoprefixer\'', function () {
        var output = require('./fixtures/enb/getTechnologies.stylus+autoprefixer.json');

        enb.getTechnologies(config, ['stylus'], true, []).must.eql(output);
    });

    it('must get technology \'css\'', function () {
        var output = require('./fixtures/enb/getTechnologies.css.json');

        enb.getTechnologies(config, ['css'], false, []).must.eql(output);
    });

    it('must get technology \'css\' + \'autoprefixer\'', function () {
        var output = require('./fixtures/enb/getTechnologies.css+autoprefixer.json');

        enb.getTechnologies(config, ['css'], true, []).must.eql(output);
    });

    it('must get minimized technology \'css\'', function () {
        var output = require('./fixtures/enb/getTechnologies.css.min.json');

        enb.getTechnologies(config, ['css'], false, ['css']).must.eql(output);
    });

    it('must get minimized technology \'css\' + \'autoprefixer\'', function () {
        var output = require('./fixtures/enb/getTechnologies.css+autoprefixer.min.json');

        enb.getTechnologies(config, ['css'], true, ['css']).must.eql(output);
    });

    it('must get technologies \'ieN.css\'', function () {
        var techs = ['ie.css', 'ie8.css', 'ie9.css', 'css'],
            output = require('./fixtures/enb/getTechnologies.ie.json');

        enb.getTechnologies(config, techs, false, []).must.eql(output);
    });

    it('must get minimized technologies \'ieN.css\'', function () {
        var techs = ['ie.css', 'ie8.css', 'ie9.css', 'css'],
            toMinify = ['ie.css', 'ie8.css', 'ie9.css', 'css'],
            output = require('./fixtures/enb/getTechnologies.ie.min.json');

        enb.getTechnologies(config, techs, false, toMinify).must.eql(output);
    });

    it('must get technology \'bemtree\'', function () {
        var output = require('./fixtures/enb/getTechnologies.bemtree.json');

        enb.getTechnologies(config, ['bemtree', 'css'], false, []).must.eql(output);
    });

    it('must get minimized technology \'bemtree\'', function () {
        var output = require('./fixtures/enb/getTechnologies.bemtree.min.json');

        enb.getTechnologies(config, ['bemtree', 'css'], false, ['bemtree.js']).must.eql(output);
    });

    it('must get technology \'node.js\'', function () {
        var output = require('./fixtures/enb/getTechnologies.node.json');

        enb.getTechnologies(config, ['node.js', 'css'], false, []).must.eql(output);
    });

    it('must get minimized technology \'node.js\'', function () {
        var output = require('./fixtures/enb/getTechnologies.node.min.json');

        enb.getTechnologies(config, ['node.js', 'css'], false, ['node.js']).must.eql(output);
    });

    it('must get technology \'browser.js\'', function () {
        var output = require('./fixtures/enb/getTechnologies.browser.json');

        enb.getTechnologies(config, ['browser.js', 'css'], false, []).must.eql(output);
    });

    it('must get minimized technology \'browser.js\'', function () {
        var output = require('./fixtures/enb/getTechnologies.browser.min.json');

        enb.getTechnologies(config, ['browser.js', 'css'], false, ['js']).must.eql(output);
    });

    it('must get technology \'browser.js\' + bemhtml', function () {
        var output = require('./fixtures/enb/getTechnologies.browser+bemhtml.json');

        enb.getTechnologies(config, ['browser.js', 'bemhtml', 'css'], false, []).must.eql(output);
    });

    it('must get technology \'browser.js\' + bh', function () {
        var output = require('./fixtures/enb/getTechnologies.browser+bh.json');

        enb.getTechnologies(config, ['browser.js', 'bh', 'css'], false, []).must.eql(output);
    });

    it('must get technology \'bemhtml\'', function () {
        var output = require('./fixtures/enb/getTechnologies.bemhtml.json');

        enb.getTechnologies(config, ['bemhtml', 'css'], false, []).must.eql(output);
    });

    it('must get minimized technology \'bemhtml\'', function () {
        var output = require('./fixtures/enb/getTechnologies.bemhtml.min.json');

        enb.getTechnologies(config, ['bemhtml', 'css'], false, ['bemhtml.js']).must.eql(output);
    });

    it('must get technology \'bh\'', function () {
        var output = require('./fixtures/enb/getTechnologies.bh.json');

        enb.getTechnologies(config, ['bh', 'css'], false, []).must.eql(output);
    });

    it('must get minimized technology \'bh\'', function () {
        var output = require('./fixtures/enb/getTechnologies.bh.min.json');

        enb.getTechnologies(config, ['bh', 'css'], false, ['bh.js']).must.eql(output);
    });

    it('must get technology \'html\' --> \'bemhtml\'', function () {
        var techs = ['bemjson.js', 'css', 'bemhtml', 'html'],
            output = require('./fixtures/enb/getTechnologies.html.bemhtml.json');

        enb.getTechnologies(config, techs, false, []).must.eql(output);
    });

    it('must get technology \'html\' --> \'bh\'', function () {
        var techs = ['bemjson.js', 'css', 'bh', 'html'],
            output = require('./fixtures/enb/getTechnologies.html.bh.json');

        enb.getTechnologies(config, techs, false, []).must.eql(output);
    });

    it('must get technology \'html\' --> \'browser.js\' + \'bemhtml\'', function () {
        var techs = ['bemjson.js', 'css', 'browser.js', 'bemhtml', 'html'],
            output = require('./fixtures/enb/getTechnologies.html.browser+bemhtml.json');

        enb.getTechnologies(config, techs, false, []).must.eql(output);
    });

    it('must get technology \'html\' --> \'browser.js\' + \'bh\'', function () {
        var techs = ['bemjson.js', 'css', 'browser.js', 'bh', 'html'],
            output = require('./fixtures/enb/getTechnologies.html.browser+bh.json');

        enb.getTechnologies(config, techs, false, []).must.eql(output);
    });

    it('must get browsers for all platforms', function () {
        var platforms = {
                desktop: ['common', 'desktop'],
                'touch-pad': ['common', 'touch', 'touch-pad'],
                'touch-phone': ['common', 'touch', 'touch-phone']
            },
            output = {
                desktop: ['last 2 versions', 'ie 10', 'ff 24', 'opera 12.16'],
                'touch-pad': ['android 4', 'ios 5'],
                'touch-phone': ['android 4', 'ios 6', 'ie 10']
            };

        enb.getBrowsers(config, platforms).must.eql(output);
    });

    it('must get styles', function () {
        var techs = ['?.css', '?.ie.css', '?.ie8.css', '?.ie9.css'],
            output = {
                css: [{ elem: 'css', url: 'index.css' }],
                ies: ['', 8, 9].map(function (i) {
                    return {
                        elem: 'css',
                        url: 'index.ie' + i + '.css'
                    };
                })
            };

        enb.getStyles(techs).must.eql(output);
    });

    it('must get minimized styles', function () {
        var techs = ['_?.css', '_?.ie.css', '_?.ie8.css', '_?.ie9.css'],
            output = {
                css: [{ elem: 'css', url: '_index.css' }],
                ies: ['', 8, 9].map(function (i) {
                    return {
                        elem: 'css',
                        url: '_index.ie' + i + '.css'
                    };
                })
            };

        enb.getStyles(techs).must.eql(output);
    });

    it('must get scripts', function () {
        enb.getScripts(['?.js']).must.eql([{ elem: 'js', url: 'index.js' }]);
    });

    it('must get minimized scripts', function () {
        enb.getScripts(['_?.js']).must.eql([{ elem: 'js', url: '_index.js' }]);
    });
});
// ---------------------------------------

// bem-tools
// --------------------------------------
describe('\'bem-tools\'', function () {
    it('must get all platforms without design', function () {
        var pls = [
                ['common', 'desktop'],
                ['common', 'touch', 'touch-pad'],
                ['common', 'touch', 'touch-phone']
            ],
            libs = [
                { name: 'bem-core', version: '' },
                { name: 'bem-components', version: '' }
            ],
            output = require('./fixtures/bem-tools/getPlatforms.no.design.json');

        bemTools.getPlatforms(pls, libs, false).must.eql(output);
    });

    it('must get all platforms with design', function () {
        var pls = [
                ['common', 'desktop'],
                ['common', 'touch', 'touch-pad'],
                ['common', 'touch', 'touch-phone']
            ],
            libs = [
                { name: 'bem-core', version: '' },
                { name: 'bem-components', version: '' }
            ],
            output = require('./fixtures/bem-tools/getPlatforms.design.json');

        bemTools.getPlatforms(pls, libs, true).must.eql(output);
    });

    it('must add preprocessor', function () {
        bemTools.addPreprocessor([], 'stylus').must.eql(['stylus', 'css']);
    });

    it('must add preprocessor after technology \'bemjson.js\'', function () {
        bemTools.addPreprocessor(['bemjson.js'], 'stylus', false).must.eql(['bemjson.js', 'stylus', 'css']);
    });

    it('must add \'css\'', function () {
        bemTools.addPreprocessor([], 'css').must.eql(['css']);
    });

    it('must add \'css\' after technology \'bemjson.js\'', function () {
        bemTools.addPreprocessor(['bemjson.js'], 'css').must.eql(['bemjson.js', 'css']);
    });

    it('must add preprocessor \'stylus\' as default', function () {
        bemTools.addPreprocessor([], undefined).must.eql(['stylus', 'css']);
    });

    it('must add \'ie.css\'', function () {
        var techs = ['ie8.css', 'ie9.css'],
            output = ['ie.css', 'ie8.css', 'ie9.css'];

        bemTools.addIe(techs).must.eql(output);
    });

    it('must not add \'ie.css\'', function () {
        var techs = ['ie.css', 'ie8.css', 'ie9.css'],
            output = ['ie.css', 'ie8.css', 'ie9.css'];

        bemTools.addIe(techs).must.eql(output);
    });

    it('must add template engine \'bemhtml\' before technology \'node.js\'', function () {
        bemTools.addTemplateEngine(['css', 'node.js'], 'bemhtml').must.eql(['css', 'bemhtml', 'node.js']);
    });

    it('must add template engine \'bemhtml\' before technology \'browser.js+bemhtml\'', function () {
        var techs = ['css', 'browser.js+bemhtml'],
            output = ['css', 'bemhtml', 'browser.js+bemhtml'];

        bemTools.addTemplateEngine(techs, 'bemhtml').must.eql(output);
    });

    it('must not add template engine ', function () {
        bemTools.addTemplateEngine([], 'my').must.eql([]);
    });

    it('must get technology \'bemjson.js\'', function () {
        var output = require('./fixtures/bem-tools/getTechnologies.bemjson.json');

        bemTools.getTechnologies(config, ['bemjson.js', 'css'], false).must.eql(output);
    });

    it('must get technology \'stylus\'', function () {
        var output = require('./fixtures/bem-tools/getTechnologies.stylus.json');

        bemTools.getTechnologies(config, ['stylus', 'css'], false).must.eql(output);
    });

    it('must get technology \'stylus\' + \'autoprefixer\'', function () {
        var output = require('./fixtures/bem-tools/getTechnologies.stylus+autoprefixer.json');

        bemTools.getTechnologies(config, ['stylus', 'css'], true).must.eql(output);
    });

    it('must get technology \'css\'', function () {
        var output = require('./fixtures/bem-tools/getTechnologies.css.json');

        bemTools.getTechnologies(config, ['css'], false).must.eql(output);
    });

    it('must get technology \'css\' + \'autoprefixer\'', function () {
        var output = require('./fixtures/bem-tools/getTechnologies.css+autoprefixer.json');

        bemTools.getTechnologies(config, ['css'], true).must.eql(output);
    });

    it('must get technologies \'ieN.css\'', function () {
        var techs = ['css', 'ie.css', 'ie8.css', 'ie9.css'],
            output = require('./fixtures/bem-tools/getTechnologies.ie.json');

        bemTools.getTechnologies(config, techs, false).must.eql(output);
    });

    it('must get technology \'bemtree\'', function () {
        var output = require('./fixtures/bem-tools/getTechnologies.bemtree.json');

        bemTools.getTechnologies(config, ['css', 'bemtree'], false).must.eql(output);
    });

    it('must get technology \'bemhtml\'', function () {
        var output = require('./fixtures/bem-tools/getTechnologies.bemhtml.json');

        bemTools.getTechnologies(config, ['css', 'bemhtml'], false).must.eql(output);
    });

    it('must get technology \'node.js\'', function () {
        var output = require('./fixtures/bem-tools/getTechnologies.node.json');

        bemTools.getTechnologies(config, ['css', 'node.js'], false).must.eql(output);
    });

    it('must get technology \'browser.js+bemhtml\'', function () {
        var output = require('./fixtures/bem-tools/getTechnologies.browser.json');

        bemTools.getTechnologies(config, ['css', 'browser.js+bemhtml'], false).must.eql(output);
    });

    it('must get technology \'html\'', function () {
        var techs = ['bemjson.js', 'css', 'bemhtml', 'html'],
            output = require('./fixtures/bem-tools/getTechnologies.html.json');

        bemTools.getTechnologies(config, techs, false).must.eql(output);
    });

    it('must get all technologies', function () {
        var techs = [
                'bemjson.js',
                'css',
                'ie.css',
                'ie8.css',
                'ie9.css',
                'bemtree',
                'bemhtml',
                'node.js',
                'browser.js+bemhtml',
                'html'
            ],
            output = require('./fixtures/bem-tools/getTechnologies.all.json');

        bemTools.getTechnologies(config, techs, false).must.eql(output);
    });

    it('must get browsers for all platforms', function () {
        var platforms = {
                desktop: ['common', 'desktop'],
                'touch-pad': ['common', 'touch', 'touch-pad'],
                'touch-phone': ['common', 'touch', 'touch-phone']
            },
            output = {
                desktop: ['last 2 versions', 'ie 10', 'ff 24', 'opera 12.16'],
                'touch-pad': ['android 4', 'ios 5'],
                'touch-phone': ['android 4', 'ios 6', 'ie 10']
            };

        bemTools.getBrowsers(config, platforms).must.eql(output);
    });

    it('must get styles', function () {
        var techs = ['css', 'ie.css', 'ie8.css', 'ie9.css'],
            output = {
                css: [{ elem: 'css', url: '_index.css' }],
                ies: ['', 8, 9].map(function (i) {
                    return {
                        elem: 'css',
                        url: '_index.ie' + i + '.css'
                    };
                })
            };

        bemTools.getStyles(techs).must.eql(output);
    });

    it('must get scripts', function () {
        bemTools.getScripts(['browser.js+bemhtml']).must.eql([{ elem: 'js', url: '_index.js' }]);
    });
});
// ---------------------------------------
