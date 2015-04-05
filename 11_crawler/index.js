var argv = require('minimist')(process.argv.slice(2));
var crawler = require("./src/crawler.js");

if(!argv.url){
    console.log("Url argument is missing");
    return false;
}
crawler.crawl(argv.url, function(err, res) {
    if (err) {
        console.log(err);
        return false;
    }
    res.each(function (href) {
        console.log(href);
    })
});


