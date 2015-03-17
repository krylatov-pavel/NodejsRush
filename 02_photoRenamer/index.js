/**
 * Created by Pavel.Krylatov on 3/16/2015.
 */
var argv = require('minimist')(process.argv.slice(2)),
    renamer = require('./renamer.js');

var path;

if (argv.dir != undefined){
    path = argv.dir;
} else {
    path = __dirname;
}

renamer.run(path, argv.name);

