var config = require("./config");
var params = require("minimist")(process.argv.slice(2));
var promise = require("bluebird");
var request = promise.promisify(require("request"));
var url = require("url");
var uniq = require("uniq");
var empty = require("is-empty");

if  (!params.user || !params.artist){
    console.log("params are missing");
    return false;
}

user = {
    uid: params.user
}

getFriends([user], 1)
    .then(function distinctUsers(users) {
        return uniq(users, function(a, b) {
            return a.uid === b.uid ? 0 : -1;
        });
    })
    .then(function getAudioTrackCount(users){
        return promise
            .map(users, function(user){
                var apiCallUrl = url.resolve(config.baseApiUrl, url.format({
                    pathname: config.getAudio,
                    query: {
                        owner_id: user.uid,
                        access_token: config.vkToken
                    }
                }));
                return request(apiCallUrl)
                    .delay(1000)
                    .then(function(response){
                        var responseObj = JSON.parse(response[1]);
                        if (!responseObj.error) {
                            console.log("%s %s audio received", user.first_name, user.last_name);
                            return responseObj.response;
                        }
                        throw new Error(responseObj.error.error_msg);
                    })
                    .then(function(audio){
                        return audio.filter(function(el) {
                            if (el.artist) return el.artist.toLowerCase().indexOf(params.artist) > -1;
                            return false;
                        })
                    })
                    .then(function(audio){
                        user.trackCount = audio.length;
                        return user;
                    })
                    .catch(function(err){
                        console.log("Cant' get %s %s audio, see error below", user.first_name, user.last_name);
                        console.log(err);
                        return null;
                    });
        }, {concurrency: 3});
    }).
    then(function(users){
        return users.filter(notEmpty);
    })
    .then(function sortByTrackCount(result){
        return result.sort(function(a, b){
            if (a.trackCount > b.trackCount)
                return -1;
            if (a.trackCount < b.trackCount)
                return 1;
            return 0;
        });
    })
    .then(function(results){
        for (var i = 0; i<5; i++){
            var user = results[i];
            console.log("%s place: %s %s with %s tracks!", i+1, user.first_name, user.last_name, user.trackCount);
        }
    })
    .catch(function(e){
        console.log("Unhandled error: %s", e);
    });

function getFriends(users, level) {
    return promise
        .map(users, function (user) {
            var apiCallUrl = url.resolve(config.baseApiUrl, url.format({
                pathname: config.getFriends,
                query: {
                    user_id: user.uid,
                    fields: "city"
                }
            }));
            var friends = request(apiCallUrl)
                .delay(1000)
                .then(function (response) {
                    console.log("%s %s friends received", user.first_name, user.last_name);
                    return JSON.parse(response[1]).response;
                })
                .catch(function(e){
                    console.log("Cant' get %s %s friends, see error below", user.first_name, user.last_name);
                    console.log(e);
                    return null;
                });
            return friends;
        }, {concurrency: 3})
        .then(function (result) {
            var currLevelUsers = [].concat.apply([], result);
            currLevelUsers = currLevelUsers.filter(notEmpty);
            if (level) {
                return getFriends(currLevelUsers, --level)
                    .then(function (result) {
                        return currLevelUsers.concat(result);
                    })
            }
            return currLevelUsers;
        });
}

function notEmpty(el){
    return !empty(el);
}