'use strict'
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const delay = require('koa-delay');
const fs = require('fs');
const router = require('koa-router')();
const app = new Koa();

app.use(delay(0, 1000));

var files = fs.readdirSync(__dirname + '/controllers');
var js_files = files.filter((f) => {
    return f.endsWith('.js');
});

for (var f of js_files) {
    console.log(`process controller: ${f}...`);
    let mapping = require(__dirname + '/controllers/' + f);
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            // console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            // console.log(`register URL mapping: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

// log request URL:
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

let templating = require('./templating')
const isProduction = process.env.NODE_ENV === 'production';
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));


let staticFiles = require('./static');
app.use(staticFiles('/static/', __dirname + '/static'));


app.use(bodyParser());


app.use(router.routes());
app.listen(3000);
console.log('app started at port 3000...');
