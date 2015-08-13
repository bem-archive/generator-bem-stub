var enb = require('../app/lib/enb'),
    config = {
        versions: require('./mocks/versions'),
        browsers: require('./mocks/browsers')
    };

describe('\'ENB\'', function () {
    it('must get all levels without design', function () {
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

        enb.getLevels(pls, libs, false).must.eql(output);
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

        enb.getLevels(pls, libs, true).must.eql(output);
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

    it('must get technology \'bemjson.js\'', function () {
        var output = require('./fixtures/enb/getTechnologies.bemjson.json');

        enb.getTechnologies(config, ['bemjson.js', 'css'], false, []).must.eql(output);
    });

    it('must get technology \'stylus\'', function () {
        var output = require('./fixtures/enb/getTechnologies.stylus.json');

        enb.getTechnologies(config, ['stylus'], false, []).must.eql(output);
    });

    it('must get minimized technology \'stylus\'', function () {
        var output = require('./fixtures/enb/getTechnologies.stylus.min.json');

        enb.getTechnologies(config, ['stylus'], false, ['css']).must.eql(output);
    });

    it('must get technology \'css\'', function () {
        var output = require('./fixtures/enb/getTechnologies.css.json');

        enb.getTechnologies(config, ['css'], false, []).must.eql(output);
    });

    it('must get minimized technology \'css\'', function () {
        var output = require('./fixtures/enb/getTechnologies.css.min.json');

        enb.getTechnologies(config, ['css'], false, ['css']).must.eql(output);
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

    it('must get browsers for all platforms', function () {
        var platforms = {
                desktop: ['common', 'desktop'],
                'touch-pad': ['common', 'touch', 'touch-pad'],
                'touch-phone': ['common', 'touch', 'touch-phone']
            },
            output = {
                desktop: ['last 2 versions', 'ie 10', 'ff 24', 'opera 12.1'],
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
        var techs = ['?.min.css', '?.min.ie.css', '?.min.ie8.css', '?.min.ie9.css'],
            output = {
                css: [{ elem: 'css', url: 'index.min.css' }],
                ies: ['', 8, 9].map(function (i) {
                    return {
                        elem: 'css',
                        url: 'index.min.ie' + i + '.css'
                    };
                })
            };

        enb.getStyles(techs).must.eql(output);
    });

    it('must get scripts', function () {
        enb.getScripts(['?.js']).must.eql([{ elem: 'js', url: 'index.js' }]);
    });

    it('must get minimized scripts', function () {
        enb.getScripts(['?.min.js']).must.eql([{ elem: 'js', url: 'index.min.js' }]);
    });
});
