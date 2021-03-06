const Koa = require('koa')
const logger = require('koa-logger')
const render = require('koa-ejs')
const path = require('path')
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session-minimal')
const cors = require('koa2-cors')

const nocache = require('./middleware/nocache')
const route = require('./routes')
const config = require('./config')

require('./database/init')()

const app = new Koa()

// ejs配置
render(app, {
    root: path.join(__dirname, 'views'),
    cache: false
})

app
    .use(cors())
    .use(static(__dirname)) // 静态资源文件加载
    .use(nocache)
    .use(bodyParser()) // 解析请求体参数
    .use(session())
    .use(logger()) // 日志
    .use(route.routes()) // 路由

// 默认端口80
const port = config.port || 80
app.listen(port, () => {
    console.log(`>>> Server is starting at port ${port}`)
})