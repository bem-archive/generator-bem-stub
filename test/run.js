var util = require('util'),
    cp = require('child_process'),
    path = require('path'),
    fs = require('fs');

var runCommand = function(cmd, opts, callback) {
    var _opts = {
        encoding: 'utf8',
        maxBuffer: 1000000*1024
    };

    Object.keys(opts).forEach(function(key) {
        _opts[key] = opts[key];
    });

    console.log('execute %s command', cmd);

    var proc = cp.exec(cmd, _opts),
        output = '';

    proc.on('exit', function(code) {
        if (code === 0) {
            callback && callback.call(null);
        }
        else {
            console.log('==> FAIL ->');
        }
    });

    proc.stderr.on('data', function(data) {
        console.log(data);
        output += data;
    });

    proc.stdout.on('data', function(data) {
        console.log(data);
        output += data;
    });
};

var path = process.argv.slice(2).shift();
fs.readdir(path, function(err, tests) {
    //console.log("!!!!!!")
    for (var test in tests) {
        if (tests[test] === '.DS_Store') continue;
        var c1 = 'cd output && yo bemgen ../' + path + tests[test] + '/' + tests[test] + '.json';
            c2 = 'cd output/' + tests[test] + ' && npm install',
            c3 = 'cd output/' + tests[test] + ' && ./node_modules/.bin/bem make';
        runCommand(c1, {}, function() {
            return runCommand(c2, {}, function() {
                return runCommand(c3, {}, null)
            })
        });
        //runCommand(c1, {}, null);
    }
});

