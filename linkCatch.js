var start = require('./catch.js');

function begin(userName) {
    var now = new Date();
    var end = now.toISOString();
    var star = new Date(Number.parseInt(end.substr(0, 4)), Number.parseInt(end.substr(5, 6)) - 2, 1).toISOString();
    start(star.substr(0, 10), end.substr(0, 10), '300', userName);
}
module.exports = begin;
