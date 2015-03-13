/**
 * Created by Pavel.Krylatov on 3/13/2015.
 */
var argv = require('minimist')(process.argv.slice(2)),
    fs = require('fs'),
    pathModule = require('path');


if (argv.dirname != undefined && argv.find != undefined && argv.replace != undefined){
    var action = (function(find, replace){
        return function(err, path){
            var name = pathModule.basename(path);

        }
    })(argv.find, argv.replace);
} else {
    console.log("argument/s is/are missing.");
}

function readDir(path, action){
    fs.readdir(path, function(err, list){
       if (err != null){
           list.forEach((function(file){
               var filePath = path + "/" + file;
               fs.stat(filePath, function(err, stat){
                   if (stat && stat.isDirectory()){
                       readDir(filePath, action);
                   } else {
                       action(null, filePath);
                   }
               });
           }));
       } else {
           action(err);
       }
    });
}