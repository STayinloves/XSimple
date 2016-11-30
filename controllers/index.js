var fn_index = async(ctx, next) => {
    ctx.render('index.html');
};
var fun_signin = async(ctx, next) => {
    const events = require('events'),
        xcatch = require('../linkCatch.js'),
        analysis = require('../analysis.js');
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '',
        idRegex = /\d{10}/;
    console.log(`signin with name: ${name}, password: ********`);

    if (idRegex.test(name) === false) {
        genHtml('fuck');
    } else {
        var rawData,
            event = new events.EventEmitter();

        xcatch(name, event);

        event.on('catchDone', function() {
            console.log('exec writeData');
            rawData = 'data:[' + analysis(name) + ']';
            event.emit('analyDone');
        })

        event.on('analyDone', function() {
            genHtml();
        });

    }

    function genHtml(f) {
        if (f === 'fuck') {
            console.log('wrong id!');
            ctx.response.body = `
            <!DOCTYPE html>
            <html>

            <head>
                <meta charset="UTF-8">
                <title>Title of the document</title>
            </head>

            <body>
            <h1>${name} isn't a valid ID!</h1>
            </body>

            </html>
            `;
        } else {
            var data = rawData;
            console.log('exec genHtml');
            ctx.render('show.html', {
                name: name,
                data: data
            });
        }
    }
};

module.exports = {
    'GET /': fn_index,
    'POST /signin': fun_signin
}
