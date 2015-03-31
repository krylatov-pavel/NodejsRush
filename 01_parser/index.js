/**
 * Created by Pavel.Krylatov on 3/13/2015.
 */
 
 //По конвенциям iTechArt да и вообще в основном рекомендуют писать каждый var с новой строки.
 //Это удобнее дебажится т.к. дебаггер будет заходить в каждую строку.
 //Можно закомментить последнюю строку Ctrl+/ и не нужно будет лезть вверх, менять запятую на ;
 //Также можно менять строки местами.
var argv = require('minimist')(process.argv.slice(2)),
    request = require('request'),
    cheerio = require('cheerio'),
    //У нас на проекте бьют по рукам за разные ковычки. Но это вообще решается валидацией. Disregard this. Вырвалось.
    baseUrl = "http://catalog.onliner.by/mobile/apple/";

//В JS принято писать if(!argv.productName) { }
//Также могут быть косяки со значений типо NaN, undefined, null etc.
//А поскольку все они falsy values то if(smth) работать будет всегда
//+ Всегда следует использовать === и !== соответственно
if (argv.productName != undefined){
    request.get(baseUrl + argv.productName, function(error, response, body){
        if (!error && response.statusCode == 200){
                var $ = cheerio.load(body);
                    //Если я не ошибаюсь Пропущен var, переменная будет в глобальном скоупе. Это не хорошо.
                    //Но вообще линтеры (i.e. jshint, jslint etc) помогут отследить такие вещи
                    price = $(".b-offers-desc__info-sub > a").text();

                //ИМХО, так более секси: console.log("Item price is: %s", price); 
                console.log("Item price is: " + price);
        }
        else {
            //Нужно стараться избегать else statements.
            //Статься на эту тему: http://williamdurand.fr/2013/06/03/object-calisthenics/
            //Аналогичную статью можно нагуглить по JS.
            //В Node.js принято писать if (err) { return что-нибудь }
            //А дальше без else логика которая обрабатывает ситуацию без ошибок
            console.log('Request error.');
        }
    })
} else {
    //См. else выше.
    console.log("--productName argument is missing")
}
