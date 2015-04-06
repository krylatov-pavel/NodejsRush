var argv = require('minimist')(process.argv.slice(2));
var crawler = require("./src/crawler.js");
var async = require("async");

if(!argv.url || !argv.level){
    console.log("Url argument is missing");
    return false;
}

var urls = [argv.url];
var level = argv.level;
var iterations = [function(cb){
    crawler.crawl(urls, cb);
}];

while(--level){
    iterations.push(function(urls, cb){
        crawler.crawl(urls, cb);
    })
}

async.waterfall(iterations,
function(err, res) {
    if (err) {
        console.log(err);
        return false;
    }
    res.each(function (href) {
        console.log(href);
    })
});