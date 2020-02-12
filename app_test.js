url = "https://segmentfault.com/q/1010000005927442"
const puppeteer = require('puppeteer-core');
const config = require('./crown_config');
const fs = require('fs');

// 本地chrome路径
const chromePath = config.chromePath;


// 有头无头模式
const IS_HEADLESS = false;

// utils
const concat = (file, header) => {
  let resFile = Buffer.concat([header, file], file.length + header.length);
  return resFile;
}

(async () => {
  const browser = await puppeteer.launch({ headless: IS_HEADLESS, executablePath: chromePath });
  // headless 有头/无头模式
  // 无头模式就是后台运行，前端不显示;headless: false就是有头模式，就会显示浏览器
  const page = await browser.newPage();

  //  获取mp4文件头
  let readHeader = () => {
    return new Promise((resolve, reject) => {
      const header = fs.readFile('./file/header.bin', (err, buf) => {
        if (err) {
          console.error('ERROR header: ' + err)
          reject(new Buffer.alloc(0));
        } else {
          resolve(buf);
        }
      })
    });
  }
  let header = await readHeader();


  let urls = [];
  let n = 0;
  page.on('response', response => {
    let url = response.url();
    let isM4s = /m4s/.test(url);
    let isVideo = (url.indexOf('https://upos-hz-mirrorks3u.acgvideo.com'))===0;
    if (isM4s && isVideo) {
      n++;
      // 操作返回数据
      bufPromise = response.buffer();
      let resHeader = JSON.parse(JSON.stringify(response.headers()));
      bufPromise.then(buf => {
        if (buf) {
          let videoName = url.split('/');
          const getCtxName = (url) => {
            let t = /\-(.*?)\.m4s/.exec(url.split('/')[7]);
            let res = '';
            if (t&&t[0]) {
              res = t[0].slice(3,-4);
            } else {
              res = 'noOne'
            }
            return res
          };
          
          let ctxName = getCtxName(url);
          let ctxInfo = resHeader['content-range'];
          let range = '';
          let size = '';
          if(resHeader['content-range']){
            range = resHeader['content-range'].split('/')[0].slice(6);
            size = resHeader['content-range'].split('/')[1];
          }
          
          let fileName = `name=${ctxName}&range=${range}&size${size}`;
          console.log(fileName);
          fs.writeFile(`./file/${fileName}.mp4`, buf, 'binary', err => {
            if (err) {
              console.log('write error: ', err);
            }
          })
        }
      }, err => {
        console.log('buffer error: ', err);
      });
    }
  });

  await page.goto('https://www.bilibili.com/video/av85365197');

  await page.waitFor(3000);
  await browser.close();
})();