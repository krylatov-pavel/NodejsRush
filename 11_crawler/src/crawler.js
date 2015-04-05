'use strict';

var cheerio = require("cheerio");
var async = require("async");
var request = require("request");

function crawl(url, callback) {
    async.waterfal([
            function getHtml(cb) {
                request.get(url, cb);
            },
            function parseHtml(status, body, cb) {
                var links = [];
                var $ = cheerio.load(body);
                $("a").each(function (link) {
                    var href = link.href.toLowerCase();
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
