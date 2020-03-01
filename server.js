const http = require('http');
const fs = require('fs')
const app = require('./app');

console.log("server start! you can browse : http://localhost:2031")

const server = http.createServer((req, res) => {
  let url = req.url;
  if (url === '/') {
    fs.readFile("./index.html", "utf-8", (err, data) => {
      if (err) {
        console.log("index.html loading is failed :" + err);
      }
      else {
        //返回index.html页面
        res.end(data);
      }
    });
  } else {
    if (/^\/bcrownGet/.test(url)) {
      let params = url.split('/');
      if (params && params[2]) {
        let avNo = params[2];
        console.log(avNo)
        app.bcrownGet(avNo);
        res.writeHead(200)
        res.write("start download")
      }
    } else {
      res.writeHead(404)
      res.write("404")
    }
    res.end();
  }
});

server.listen(2031);