var fs = require('fs'),
    path = require('path');

var dirs = fs.readdirSync('../basic');

for (var dir in dirs) {
    var pack = fs.readFileSync(path.join('..', 'basic', dirs[dir], dirs[dir] + '.json')).toString();
    var _pack = pack.replace('"collector": "bem"', '"collector": "bem-tools"');
    fs.writeFileSync(path.join('..', 'basic', dirs[dir], dirs[dir] + '.json'), _pack);
}