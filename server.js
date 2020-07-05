/**
 * moudules
 */
const http = require('http');
const url = require('url');
const path = require('path');
const express = require('express');
const expressWs = require('express-ws');
const bodyParser = require('body-parser');
const getDownloadInfo = require('./services/getDownloadInfo');
const config = require('./crown_config');

/**
 * static value
 */
const PORT = config.serverPort;
const app = express();
expressWs(app);

/**
 * set global
 */
const srcDir = path.resolve(__dirname, 'src');
global.srcDir = srcDir;

//配置 body-parser 中间件 (插件, 专门用来解析表单 POST 请求)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({txtended: false}))
//parse application/json
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'src/view/dist')))

/**
 * cross-origin
 */
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

/**
 * route
 */
/**
 * 下载视频长连接接口
 */
app.ws('/api/downloadInfo',getDownloadInfo);
/**
 * 本地下载视频接口 直接调用了该目录下的app.js文件来进行下载
 */
app.get('/api/bcrownGet',(req,res)=>{
  let service = require('./app');

  let video = req.query.video // 入参为'BVxxxxxxx'
  service.bcrownGet(video)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
  console.log(`open browser and visit: localhost:2031 to test`);
}).on('error', (err)=>{
  console.log('on error handler');
  console.log(err);
});

process.on('uncaughtException', function(err) {
  console.log('process.on handler');
  console.log(err);
});