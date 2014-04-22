var fs = require('fs'),
    shell = require('shelljs'),
    path = require('path');

var tests = fs.readdirSync('input');

var toolsInputNames = [
    'make.js',
    'blocks.js',
    'bundles.js',
    'package.json',
    'bower.json',
    'index.bem.js'
],
    toolsOutputNames = [
    path.join('.bem', 'make.js'),
    path.join('.bem', 'levels', 'blocks.js'),
    path.join('.bem', 'levels', 'bundles.js'),
    'package.json',
    'bower.json',
    ''
];

var enbInputNames = [
    'make.js',
    'package.json',
    'bower.json',
    'index.bem.js'
],
    enbOutputNames = [
    '.enb/make.js',
    'package.json',
    'bower.json',
    ''
];

shell.exec('rm -rf output && mkdir output');

tests.map(function(test) {

    if (test === '.DS_Store') return;

    shell.exec('cd output && yo bem-stub ' + path.join('..', 'input', test, 'answers.json --no-deps'));

    var answers = JSON.parse(fs.readFileSync(path.join('input', test, 'answers.json'), 'utf-8')),
        collector = answers.collector,
        bemjson = false,
        pl = answers.platforms[answers.platforms.length - 1];

    input = collector === 'bem-tools' ? toolsInputNames : enbInputNames;
    output = collector === 'bem-tools' ? toolsOutputNames : enbOutputNames;

    answers.techs.indexOf('bemjson.js') > -1 && (bemjson = true);

    output[output.length - 1] = pl[pl.length - 1] + path.join('.bundles', 'index', 'index.' + (bemjson ? 'bemjson.js' : 'bemdecl.js'));

    for (var file = 0; file < input.length; file++) {
        if (fs.readFileSync(path.join('input', test, input[file]), 'utf-8') !== fs.readFileSync(path.join('output', test, output[file]), 'utf-8')) {
            console.log("FAIL ==> " + test + " --> " + input[file] + " !== " + output[file]);
            process.exit(1);
        }
    }
});

shell.exec('rm -rf output');

console.log('\n==> OK! -> ' + (tests.indexOf('.DS_Store') > -1 ? tests.length - 1 : tests.length) + ' tests');
