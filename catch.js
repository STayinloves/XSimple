'use strict'
var superagent = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');

var O = {
    data: "",
    v: (startTime, endTime, pageSize, userName, callback) => {
        console.log('run' + startTime + ' ' + endTime + ' ' + pageSize);
        superagent
            .get(
                'http://202.204.105.98/InstanceMessage-portlet/Applyextend/getCardDetailList.action')
            .query('idserial=' + userName)
            .query('searchStartTime=' + startTime)
            .query('searchEndTime=' + endTime)
            .query('pageBean.pageSize=' + pageSize)
            .set('Content-Type', 'text/html')
            .end(function(err, res) {
                if (err || !res.ok) {
                    console.log('Oh no! error');
                } else {
                    var $ = cheerio.load(res.text);
                    var items = $("td.tab_xx");
                    var arr = [];
                    for (var i = 0; i < items.length; i++) {
                        if (i % 4 == 0) continue;
                        if (i % 4 == 1)
                            arr.push("{\"cost\":\"" + $("td.tab_xx")[i].children[0].data + '\",');
                        if (i % 4 == 2)
                            arr.push("\"time\":\"" + $("td.tab_xx")[i].children[0].data + '\",');
                        if (i % 4 == 3)
                            arr.push("\"place\":\"" + $("td.tab_xx")[i].children[0].data + '\"},');
                    }
                    var arrStr = arr.join('');
                    O.data = "{\"item\":[" + arrStr.substr(0, arrStr.length - 1) + "]}";
                    console.log('got remote data complete');
                    callback();
                }
            });
    }
}
var start = (startTime, endTime, pageSize, userName) => {
    var writeData = () => {
        try {
            fs.writeFileSync('./data/' + userName + startTime + '-' + endTime + '.json', O.data);
            console.log('write data complete');
        } catch (e) {
            console.log(e);
        }
    };
    O.v(startTime, endTime, pageSize, userName, writeData);
}
module.exports = start;
