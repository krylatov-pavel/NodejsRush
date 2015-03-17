/**
 * Created by Pavel.Krylatov on 3/16/2015.
 */
var fs = require("fs"),
    path = require("path"),
    exifImage = require("exif").ExifImage,
    async = require("async"),
    dateutil  = require("dateutil");

dateutil._parsers['yyyy:mm:dd hh:mm:ss'] = {
    test: /^\d{4}:[0-1]{1}\d{1}:[0-3]{1}\d{1} [0-2]{1}\d{1}:[0-6]{1}\d{1}:[0-6]{1}\d{1}$/,
    parse: function ( str ) {
        var bits = str.replace(" ", ":").split(":"),
            year = parseInt( bits[0]),
            month = parseInt(bits[1]) - 1,
            day = parseInt(bits[2]),
            hour = parseInt(bits[3]),
            minute = parseInt(bits[4]),
            second = parseInt(bits[5]);

        return new Date( year, month, day, hour, minute, second);
    }
};

function run(dir, name){
    fs.stat(dir, function(err, stats){
        if (err == null){
            if (stats.isDirectory){
                var total = 0;
                fs.readdir(dir, function(err, list){
                    if (err == null){
                        var files = list.map(function (file) {
                            return path.join(dir, file);
                        }).filter(function (file) {
                            return fs.statSync(file).isFile();
                        });

                        async.sortBy(files, function(file, callback){
                            new exifImage({image: file}, function (err, exifData) {
                                if (!err) {
                                    var date = dateutil.parse(exifData.exif.DateTimeOriginal);
                                    callback(null, date);
                                } else {
                                    callback(null, new Date(fs.statSync(file).ctime));
                                }
                            });
                        }, function(err, files) {
                            files.forEach(function (file, i) {
                                renameFile(file, name + zeroFill(i, files.length.toString().length));
                            });
                        });
                    }
                });
            }
        } else {
            console.log(dir + "is not directory.")
        }
    });
}

function renameFile(file, name){
    var newName = path.dirname(file) + "\\" + name + path.extname(file);
    fs.exists(newName, function(exist){
        if (!exist){
            fs.rename(file, newName);
        } else {
            console.log("Can't rename " + file + " to " + newName+ " because file with that name already exist.");
        }
    })
}

function zeroFill(number, width) {
    var zeroString = "";
    while (width-- > 0) {
        zeroString += "0";
    }
    return zeroString.slice(0, -(number + "").length) + number + "";
}

module.exports = {
    run: run
};

