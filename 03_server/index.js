/**
 * Created by Pavel.Krylatov on 3/16/2015.
 */
var http = require('http'),
    mime = require('mime'),
    fs = require('fs');

var server = http.createServer(function(request, response){
    //path.join (Windows vs. Linux)
    var filePath = "." + request.url;

    fs.exists(filePath, function(exists){
       if (exists){
           fs.readFile(filePath, function(err, content){
               //if (err)
               if (err == null){
                   var mimeType = mime.lookup(filePath);

                   response.writeHead(200, {"content-type" : mimeType});
                   response.end(content, "utf-8");
               } else {
                   response.writeHead(500, {"content-type" : "text/plain"});
                   response.end(err, "utf-8");
               }
           })

        //Else это зло if (smth) { return } идем дальше
       } else {
           response.writeHead(404, {"content-type" : "text/plain"});
           response.end("File not found", "utf-8");
       }
    });
});

//Тут вторым параметром идет колбек. Можно console.log когда сервер фактически запустился
server.listen(8080);

//Этот сервер может отдать index.js т.е. свои же исохдники, если запросить. :) То есть подвержен exploit'у.
//Но суть вообще в том, что для продакшна нужно использовать nginx или на худой конец express-static
//Так как таких эксплоитов огромное количество и все самому реализовать это очень проблематично.
