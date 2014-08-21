var fs = require('fs'),
    bemtools = require('../app/lib/bem-tools'),
    enb = require('../app/lib/enb'),
    configPath = 'app/templates/config.json';

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
            output = JSON.parse(fs.readFileSync('test/fixtures/bem-tools/getPlatforms.no.design.json', 'utf-8'));

        bemtools.getPlatforms(pls, libs, false).must.eql(output);
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
            output = JSON.parse(fs.readFileSync('test/fixtures/bem-tools/getPlatforms.design.json', 'utf-8'));

        bemtools.getPlatforms(pls, libs, true).must.eql(output);
    });

    it('must add preprocessor', function () {

        bemtools.addPreprocessor([], 'stylus').must.eql(['stylus', 'css']);
    });

    it('must add preprocessor after technology \'bemjson.js\'', function () {

        bemtools.addPreprocessor(['bemjson.js'], 'stylus').must.eql(['bemjson.js', 'stylus', 'css']);
    });

    it('must add \'css\'', function () {

        bemtools.addPreprocessor([], 'css').must.eql(['css']);
    });

    it('must add \'css\' after technology \'bemjson.js\'', function () {

        bemtools.addPreprocessor(['bemjson.js'], 'css').must.eql(['bemjson.js', 'css']);
    });

    it('must add preprocessor \'stylus\' as default', function () {

        bemtools.addPreprocessor([], undefined).must.eql(['stylus', 'css']);
    });

    it('must add \'ie.css\'', function () {

        var techs = ['ie6.css', 'ie7.css', 'ie8.css', 'ie9.css'],
            output = ['ie.css', 'ie6.css', 'ie7.css', 'ie8.css', 'ie9.css'];

        bemtools.addIe(techs).must.eql(output);
    });


    it('must not add \'ie.css\'', function () {

        var techs = ['ie.css', 'ie6.css', 'ie7.css', 'ie8.css', 'ie9.css'],
            output = ['ie.css', 'ie6.css', 'ie7.css', 'ie8.css', 'ie9.css'];

        bemtools.addIe(techs).must.eql(output);
    });

    it('must add template engine \'bemhtml\' before technology \'node.js\'', function() {

        bemtools.addTemplateEngine(['css', 'node.js'], 'bemhtml').must.eql(['css', 'bemhtml', 'node.js']);
    });

    it('must add template engine \'bemhtml\' before technology \'browser.js+bemhtml\'', function() {

        bemtools.addTemplateEngine(['css', 'browser.js+bemhtml'], 'bemhtml').must.eql(['css', 'bemhtml', 'browser.js+bemhtml']);
    });

    it('must not add template engine ', function() {

        bemtools.addTemplateEngine([], 'my').must.eql([]);
    });

    it('must get technology \'bemjson.js\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/bem-tools/getTechnologies.bemjson.json', 'utf-8'));

        bemtools.getTechnologies(configPath, ['bemjson.js', 'css']).must.eql(output);
    });

    it('must get technology \'stylus\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/bem-tools/getTechnologies.stylus.json', 'utf-8'));

        bemtools.getTechnologies(configPath, ['stylus', 'css']).must.eql(output);
    });

    it('must get technology \'roole\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/bem-tools/getTechnologies.roole.json', 'utf-8'));

        bemtools.getTechnologies(configPath, ['roole', 'css']).must.eql(output);
    });

    it('must get technology \'less\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/bem-tools/getTechnologies.less.json', 'utf-8'));

        bemtools.getTechnologies(configPath, ['less', 'css']).must.eql(output);
    });

    it('must get technology \'css\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/bem-tools/getTechnologies.css.json', 'utf-8'));

        bemtools.getTechnologies(configPath, ['css']).must.eql(output);
    });

    it('must get technologies \'ieN.css\'', function () {

        var techs = ['css', 'ie.css', 'ie6.css', 'ie7.css', 'ie8.css', 'ie9.css'],
            output = JSON.parse(fs.readFileSync('test/fixtures/bem-tools/getTechnologies.ie.json', 'utf-8'));

        bemtools.getTechnologies(configPath, techs).must.eql(output);
    });

    it('must get technology \'bemtree\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/bem-tools/getTechnologies.bemtree.json', 'utf-8'));

        bemtools.getTechnologies(configPath, ['css', 'bemtree']).must.eql(output);
    });

    it('must get technology \'bemhtml\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/bem-tools/getTechnologies.bemhtml.json', 'utf-8'));

        bemtools.getTechnologies(configPath, ['css', 'bemhtml']).must.eql(output);
    });

    it('must get technology \'node.js\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/bem-tools/getTechnologies.node.json', 'utf-8'));

        bemtools.getTechnologies(configPath, ['css', 'node.js']).must.eql(output);
    });

    it('must get technology \'browser.js+bemhtml\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/bem-tools/getTechnologies.browser.json', 'utf-8'));

        bemtools.getTechnologies(configPath, ['css', 'browser.js+bemhtml']).must.eql(output);
    });

    it('must get technology \'html\'', function () {

        var techs = ['bemjson.js', 'css', 'bemhtml', 'html'],
            output = JSON.parse(fs.readFileSync('test/fixtures/bem-tools/getTechnologies.html.json', 'utf-8'));

        bemtools.getTechnologies(configPath, techs).must.eql(output);
    });

    it('must get all technologies', function () {

        var techs = [
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
                'browser.js+bemhtml',
                'html'
            ],
            output = JSON.parse(fs.readFileSync('test/fixtures/bem-tools/getTechnologies.all.json', 'utf-8'));

        bemtools.getTechnologies(configPath, techs).must.eql(output);
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

        bemtools.getBrowsers(configPath, platforms).must.eql(output);
    });

    it('must get styles', function () {

        var techs = ['css', 'ie.css', 'ie6.css', 'ie7.css', 'ie8.css', 'ie9.css'],
            output = {
                css: [{ elem: 'css', url: 'css' }],
                ies: ['', 6, 7, 8, 9].map(function(i) {
                    return {
                        elem: 'css',
                        url: 'ie' + i + '.css'
                    };
                })
            };

        bemtools.getStyles(techs).must.eql(output);
    });

    it('must get scripts', function () {

        bemtools.getScripts(['browser.js+bemhtml']).must.eql([{ elem: 'js', url: 'js' }]);
    });

});

// ---------------------------------------


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
            output = JSON.parse(fs.readFileSync('test/fixtures/enb/getPlatforms.no.design.json', 'utf-8'));

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
            output = JSON.parse(fs.readFileSync('test/fixtures/enb/getPlatforms.design.json', 'utf-8'));

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

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.bemjson.json', 'utf-8'));

        enb.getTechnologies(configPath, ['bemjson.js', 'css'], []).must.eql(output);
    });

    it('must get technology \'stylus\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.stylus.json', 'utf-8'));

        enb.getTechnologies(configPath, ['stylus'], []).must.eql(output);
    });

    it('must get technology \'roole\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.roole.json', 'utf-8'));

        enb.getTechnologies(configPath, ['roole'], []).must.eql(output);
    });

    it('must get technology \'less\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.less.json', 'utf-8'));

        enb.getTechnologies(configPath, ['less'], []).must.eql(output);
    });

    it('must get technology \'css\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.css.json', 'utf-8'));

        enb.getTechnologies(configPath, ['css'], []).must.eql(output);
    });

    it('must get minimized technology \'css\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.css.min.json', 'utf-8'));

        enb.getTechnologies(configPath, ['css'], ['css']).must.eql(output);
    });

    it('must get technologies \'ieN.css\'', function () {

        var techs = ['ie.css', 'ie6.css', 'ie7.css', 'ie8.css', 'ie9.css', 'css'],
            output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.ie.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, []).must.eql(output);
    });

    it('must get minimized technologies \'ieN.css\'', function () {

        var techs = ['ie.css', 'ie6.css', 'ie7.css', 'ie8.css', 'ie9.css', 'css'],
            toMinify = ['ie.css', 'ie6.css', 'ie7.css', 'ie8.css', 'ie9.css', 'css'],
            output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.ie.min.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, toMinify).must.eql(output);
    });

    it('must get technology \'bemtree.js\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.bemtree.json', 'utf-8'));

        enb.getTechnologies(configPath, ['bemtree.js', 'css'], []).must.eql(output);
    });

    it('must get minimized technology \'bemtree.js\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.bemtree.min.json', 'utf-8'));

        enb.getTechnologies(configPath, ['bemtree.js', 'css'], ['bemtree.js']).must.eql(output);
    });

    it('must get technology \'node.js\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.node.json', 'utf-8'));

        enb.getTechnologies(configPath, ['node.js', 'css'], []).must.eql(output);
    });

    it('must get minimized technology \'node.js\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.node.min.json', 'utf-8'));

        enb.getTechnologies(configPath, ['node.js', 'css'], ['node.js']).must.eql(output);
    });

    it('must get technology \'browser.js\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.browser.json', 'utf-8'));

        enb.getTechnologies(configPath, ['browser.js', 'css'], []).must.eql(output);
    });

    it('must get minimized technology \'browser.js\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.browser.min.json', 'utf-8'));

        enb.getTechnologies(configPath, ['browser.js', 'css'], ['js']).must.eql(output);
    });

    it('must get technology \'bemhtml\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.bemhtml.json', 'utf-8'));

        enb.getTechnologies(configPath, ['bemhtml', 'css'], []).must.eql(output);
    });

    it('must get minimized technology \'bemhtml\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.bemhtml.min.json', 'utf-8'));

        enb.getTechnologies(configPath, ['bemhtml', 'css'], ['bemhtml.js']).must.eql(output);
    });

    it('must get technology \'bh\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.bh.json', 'utf-8'));

        enb.getTechnologies(configPath, ['bh', 'css'], []).must.eql(output);
    });

    it('must get minimized technology \'bh\'', function () {

        var output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.bh.min.json', 'utf-8'));

        enb.getTechnologies(configPath, ['bh','css'], ['bh.js']).must.eql(output);
    });

    it('must get technology \'html\' --> \'bemhtml\'', function () {

        var techs = ['bemjson.js', 'css', 'bemhtml', 'html'],
            output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.html.bemhtml.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, []).must.eql(output);
    });

    it('must get technology \'html\' --> \'bh\'', function () {

        var techs = ['bemjson.js', 'css', 'bh', 'html'],
            output = JSON.parse(fs.readFileSync('test/fixtures/enb/getTechnologies.html.bh.json', 'utf-8'));

        enb.getTechnologies(configPath, techs, []).must.eql(output);
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

        enb.getBrowsers(configPath, platforms).must.eql(output);
    });

    it('must get styles', function () {

        var techs = ['css', 'ie.css', 'ie6.css', 'ie7.css', 'ie8.css', 'ie9.css'],
            output = {
                css: [{ elem: 'css', url: 'css' }],
                ies: ['', 6, 7, 8, 9].map(function(i) {
                    return {
                        elem: 'css',
                        url: 'ie' + i + '.css'
                    };
                })
            };

        enb.getStyles(techs).must.eql(output);
    });

    it('must get minimized styles', function () {

        var techs = ['min.css', 'min.ie.css', 'min.ie6.css', 'min.ie7.css', 'min.ie8.css', 'min.ie9.css'],
            output = {
                css: [{ elem: 'css', url: 'min.css' }],
                ies: ['', 6, 7, 8, 9].map(function(i) {
                    return {
                        elem: 'css',
                        url: 'min.ie' + i + '.css'
                    };
                })
            };

        enb.getStyles(techs).must.eql(output);
    });

    it('must get scripts', function () {

        enb.getScripts(['js']).must.eql([{ elem: 'js', url: 'js' }]);
    });

    it('must get minimized scripts', function () {

        enb.getScripts(['min.js']).must.eql([{ elem: 'js', url: 'min.js' }]);
    });

});

// ---------------------------------------
