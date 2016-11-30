var start = require('./catch.js');

function begin(userName, event) {
    var now = new Date(),
        end = now.toISOString(),
        star = new Date(Number.parseInt(end.substr(0, 4)), Number.parseInt(end.substr(5, 6)) - 2, 1).toISOString();
    start(star.substr(0, 10), end.substr(0, 10), '300', userName, event);
}
module.exports = begin;
