'use strict';

var cheerio = require("cheerio");
var async = require("async");
var request = require("request");

function crawl(url, callback) {
    async.waterfall([
            function getHtml(cb) {
                request.get(url, cb);
            },
            function parseHtml(status, body, cb) {
                var links = [];
                var $ = cheerio.load(body);
                $("a").each(function (i, link) {
                    var href = link.attribs.href.toLowerCase();
                    if (links.indexOf(href)) {
                        links.push(href);
                    }
                });
                cb(links);
            }
        ], callback
    );
}

module.exports = {
    crawl: crawl
};
