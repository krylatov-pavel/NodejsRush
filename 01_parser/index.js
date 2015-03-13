/**
 * Created by Pavel.Krylatov on 3/13/2015.
 */
var argv = require('minimist')(process.argv.slice(2)),
    request = require('request'),
    cheerio = require('cheerio'),
    baseUrl = "http://catalog.onliner.by/mobile/apple/";

if (argv.productName != undefined){
    request.get(baseUrl + argv.productName, function(error, response, body){
        if (!error && response.statusCode == 200){
                var $ = cheerio.load(body);
                    price = $(".b-offers-desc__info-sub > a").text();

                console.log("Item price is: " + price);
        }
        else {
            console.log('Request error.');
        }
    })
} else {
    console.log("--productName argument is missing")
}