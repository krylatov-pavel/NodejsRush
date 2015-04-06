'use strict';

var cheerio = require("cheerio");
var async = require("async");
var request = require("request");

function crawl(urls, callback){
    var links = [];
    async.each(
        urls,
        function(url, cb){
            readLinks(url, function(err, result) {
                links = links.concat(result);
                cb(err);
            });
        },
        function(err, result){
            callback(err, links);
        }
    )
}

function readLinks(url, callback) {
    async.waterfall([
            function getHtml(cb) {
                request.get(url, cb);
            },
            function parseHtml(status, body, cb) {
                var links = [];
                var $ = cheerio.load(body);
                $("a").each(function (i, link) {
                    var href = link.attribs.href;
                    if (links.indexOf(href)) {
                        links.push(href);
                    }
                });
                cb(null, links);
            }
        ], callback
    );
}

module.exports = {
    crawl: crawl
};
