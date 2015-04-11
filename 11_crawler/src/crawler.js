'use strict';

var cheerio = require("cheerio");
var async = require("async");
var request = require("request");
var urlModule = require('url');

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
                    if (link.attribs.href) {
                        var href = normalizeLink(url, link.attribs.href);
                        if (links.indexOf(href)) {
                            links.push(href);
                        }
                    }
                });
                cb(null, links);
            }
        ], callback
    );
}

function normalizeLink(base, url){
    var isAbsolute = /^https?:\/\//i;
    if (!isAbsolute.test(url))
    {
        url = urlModule.resolve(base, url);
    }
    return url;
}

module.exports = {
    crawl: crawl
};
