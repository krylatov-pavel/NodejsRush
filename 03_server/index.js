/**
 * Created by Pavel.Krylatov on 3/16/2015.
 */
var http = require('http'),
    mime = require('mime'),
    fs = require('fs');

var server = http.createServer(function(request, response){
    var filePath = "." + request.url;

    fs.exists(filePath, function(exists){
       if (exists){
           fs.readFile(filePath, function(err, content){
               if (err == null){
                   var mimeType = mime.lookup(filePath);

                   response.writeHead(200, {"content-type" : mimeType});
                   response.end(content, "utf-8");
               } else {
                   response.writeHead(500, {"content-type" : "text/plain"});
                   response.end(err, "utf-8");
               }
           })

       } else {
           response.writeHead(404, {"content-type" : "text/plain"});
           response.end("File not found", "utf-8");
       }
    });
});

server.listen(8080);