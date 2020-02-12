const request = require('request');
const path = require('path');
const fs = require('fs');
// https://segmentfault.com/a/1190000016704648
let url = 'https://upos-hz-mirrorks3u.acgvideo.com/upgcxcode/20/02/149270220/149270220-1-30112.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1581088889&gen=playurl&os=ks3u&oi=0&trid=e38d334f199b4141b253dc961a209e34u&platform=pc&upsig=ab3e639d429e382ed6890a8a0c6cf03b&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&mid=34967380'
let haeders = {//设置请求头
  "content-type": "application/json",
  "Accept": "*/*",
  "Accept-Encoding": "identity",
  "Accept-Language": "zh-CN,zh;q=0.9",
  "Connection": " keep-alive",
  "Host": "upos-hz-mirrorks3u.acgvideo.com",
  "Origin": "https://www.bilibili.com",
  "Referer": "https://www.bilibili.com/video/av20391272",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "cross-site",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36",
};
const size = 82726136;
const SINGLE = 1024 * 1000;
const file = path.join(__dirname, './download/video_3.mp4');
try {
  fs.closeSync(fs.openSync(file, 'w'));
} catch (err) {
  return console.error(err);
}
const length = parseInt(size / SINGLE);
console.log(`已找到视频文件，分${length}片下载`)
for (let i = 0; i < length; i++) {
  let start = i * SINGLE;
  let end = i == length ? (i + 1) * SINGLE - 1 : size - 1;
  let header_p = Object.assign({ 'Range': `bytes=${start}-${end}` }, haeders)
  let stream = fs.createWriteStream(file, { start, end });
  stream.on('finish', () => {
    console.log(`文件${i}写入成功`)
  })
  request({
    method: 'GET',
    uri: url,
    headers: header_p,
  }).on('response', (resp) => {
    const range = resp.headers['content-range'];
    const match = /bytes ([0-9]*)-([0-9]*)/.exec(range);
    start = match[1];
    end = match[2];
  }).pipe(stream);
}
// request(opt, (error, response, body) => {
//   console.log(body.length)
//   let fileName = 'all'
//   fs.writeFile(`./file/${fileName}.mp4`, body, 'binary', err => {
//     if (err) {
//       console.log('write error: ', err);
//     }
//   })
// })