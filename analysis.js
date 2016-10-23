var fs = require('fs');

var jsonData = {};
var now = new Date(),
    end = now.toISOString();
var star = new Date(Number.parseInt(end.substr(0, 4)), Number.parseInt(end.substr(5, 6)) - 2, 1).toISOString();

function analy(userName) {
    var returnJson = "";
    try {
        jsonData = JSON.parse(fs.readFileSync('./data/' + userName + star.substr(0, 10) + '-' + end.substr(0, 10) + '.json', 'utf8'));
    } catch (e) {
        console.log(e);
    }

    var myMap = new Map(),
        costAmount = 0;
    for (var i in jsonData["item"]) {
        var cost = jsonData['item'][i].cost,
            place = jsonData['item'][i].place,
            costFloat = Number.parseFloat(cost);
        costAmount += costFloat;
        if (myMap.has(place)) {
            myMap.set(place, costFloat + myMap.get(place));
        } else
            myMap.set(place, costFloat);
    }
    myMap.forEach(function(value, key) {
        returnJson += "{value: " + value.toFixed(2) + ', name:\'' + key + '\'},'
    }, myMap)
    returnJson = returnJson.substr(0, returnJson.length - 1);
    console.log("analysis complete");
    fs.unlink('./data/' + userName + star.substr(0, 10) + '-' + end.substr(0, 10) + '.json', function() {
        console.log("remove private data");
    });
    jsonData = {};
    return returnJson;
}
module.exports = analy;
