/**
 * moudules
 */
const http = require('http');
const url = require('url');
const path = require('path');
const express = require('express');
const expressWs = require('express-ws');
const bodyParser = require('body-parser');
const getDownloadInfo = require('./services/getDownloadInfo')

/**
 * static value
 */
const PORT = 2031;
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
 * 获得代理ip的接口
 */
app.ws('/api/downloadInfo',getDownloadInfo);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
}).on('error', (err)=>{
  console.log('on error handler');
  console.log(err);
});

process.on('uncaughtException', function(err) {
  console.log('process.on handler');
  console.log(err);
});