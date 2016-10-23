const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const xcatch = require('./linkCatch.js');
const delay = require('koa-delay')
const analysis = require('./analysis.js')

// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();

const app = new Koa();

app.use(delay(0, 300));

// log request URL:
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

app.use(bodyParser());

// add url-route:
router.get('/hello/:name', async(ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
});

router.get('/', async(ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value=""></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
});

router.post('/signin', async(ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '',
        idRegex = /\d{10}/;
    console.log(`signin with name: ${name}, password: ${password}`);

    if (idRegex.test(name) === false) {
        genHtml('fuck');
    } else {

        console.log('exec readRemote');
        xcatch(name);

        var rawData;

        function func2() {
            console.log('exec writeData');
            rawData = 'data:[' + analysis(name) + ']';
        }

        setTimeout(func2, 100);
        setTimeout(genHtml, 300);
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
            ctx.response.body = `
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <title>Title of the document</title>
            <script src="//cdn.bootcss.com/echarts/3.2.3/echarts.common.js"></script>
        </head>

        <body>
        <h1>Welcome, ${name}!</h1>
        <div id="main" style="width: 600px;height:400px;float:right;"></div>
        <script type="text/javascript">
            var myChart = echarts.init(document.getElementById('main'));

            myChart.setOption({
                series : [
                        {
                        name: '钱去哪儿了',
                        type: 'pie',
                        // roseType: 'angle',
                        radius: '75%',
                        ${data}
                    }
                ],
                tooltip: {
                    formatter: '{b0}: {c0}元'
                },
                animationDuration: 2000
            })
        </script>

        </body>

        </html>
        `;
        }
    }
});

// add router middleware:
app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');
