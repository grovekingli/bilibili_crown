// const http = require('http');
// io= require('socket.io');
// const fs = require('fs')
// const app = require('./app');
// const getDownloadInfo = require('./services');
//
// console.log("server start! you can browse : http://localhost:2031")
//
// const server = http.createServer((req, res) => {
//   let url = req.url;
//   if (url === '/') {
//     fs.readFile("./index.html", "utf-8", (err, data) => {
//       if (err) {
//         console.log("index.html loading is failed :" + err);
//       }
//       else {
//         //返回index.html页面
//         res.end(data);
//       }
//     });
//   } else {
//     if (/^\/bcrownGet/.test(url)) {
//       let params = url.split('/');
//       if (params && params[2]) {
//         let avNo = params[2];
//         console.log(avNo);
//         app.bcrownGet(avNo);
//         res.writeHead(200);
//         res.write("start download")
//       }
//     } else {
//       res.writeHead(404)
//       res.write("404")
//     }
//     res.end();
//   }
// });
//
// server.listen(2031);
// let wsServer = io.listen(server);
//
// wsServer.on('connection', sock=>{
//   sock.on('aaa', function(a,b){         // name -> 'aaa' 要与前台的 name 保持一致
//     console.log(a);
//     console.log(b);
//     console.log(arguments)
//   });   // 'aaa'事件名与前台的一致
//   sock.on('disconnect', function(a,b){         // name -> 'aaa' 要与前台的 name 保持一致
//     console.log('disconnect');
//   });
//   sock.on('progress', function(a,b){         // name -> 'aaa' 要与前台的 name 保持一致
//     console.log('connect');
//   });
//
//   // setInterval(function(){
//   //   sock.emit('bbb', '服务器发来的数据')  // name -> 'bbb' 要与前台的 name 保持一致
//   // }, 2000)
// });
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
// app.use(`/`, router)
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