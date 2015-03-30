/**
 * Created by Pavel.Krylatov on 3/13/2015.
 */
var argv = require('minimist')(process.argv.slice(2)),
    fs = require('fs'),
    pathModule = require('path');

//Зачем нам else? Без него все гораздо красивее. :)
//!=  ---> if(falsy),   != это зло, нужно !==
if (argv.dirname != undefined && argv.find != undefined && argv.replace != undefined){
    var rename = (function(find, replace){
        return function(err, path){
            //Похоже, что ошибки не хендлятся. Надо бы их либо throw либо хотя бы console.error();
            var name = pathModule.basename(path).toLowerCase();
            if (name.indexOf(find) > -1){
                //join ить пути всегда нужно path.join'ом. Т.к. он правильно кроссплатформенно поставит слеши (/ или \)
                //чтобы работало и под виндой \ и под linux /
                var newPath = [pathModule.dirname(path), name.replace(find, replace)].join("/");
                //Ошибку бы как-нибудь обработать...
                fs.rename(path, newPath, null);
            }
        }
    })(argv.find, argv.replace);
    readDir(argv.dirname, rename);
} else {
    console.log("argument/s is/are missing.");
}

function readDir(path, action){
    fs.readdir(path, function(err, list){
        // обычно пишут if (err) или if (!err), == это нехорошо
       if (err == null){
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

//Сама рекурсия, думаю сделана на уровне :) Я вникать сильно не стал.
//Тут идея в чем. Что нод любит простоту. Если можно самому не писать рекурсию, то можно взять да и заюзать какой-нибудь
//сторонний модуль, чтобы звездочек было побольше вроде glob.
//Но как квест, по директориям полазить очень даже.
