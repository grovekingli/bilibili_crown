/**
 * Module dependencies
 */

const PubSub = require('../../pubsub');
const request = require('request');
const path = require('path');
const fs = require('fs');

class DownloadManger extends PubSub {

  /**
  * 下载多个视频
  * @param {Array} [avArr] 需要下载的视频列表
  * @param {String} [item.name] 文件名
  * @param {String} [item.url] 资源链接
  * @param {String} [item.filePath] 指定输出文件的目录
  * @param {Number} [item.size] 文件大小
  */
  constructor(avArr) {
    super();
  }

  /**
  * @param {String} [name] 文件名
  * @param {String} [url] 资源链接
  * @param {String} [filePath] 指定输出文件的目录
  * @param {Number} [size] 文件大小
  */
  downloadOne() {
    if (typeof name !== 'string') throw new TypeError('name must be a string!');
    if (typeof url !== 'string') throw new TypeError('url must be a string!');
    if (typeof filePath !== 'string') throw new TypeError('path must be a string!');
    if (typeof size !== 'number') throw new TypeError('size must be a number!');

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

    const SINGLE = 1024 * 1000;
    const file = `${filePath}/${name}.mp4`;
    let finishNum = 0;
    try {
      fs.closeSync(fs.openSync(file, 'w'));
    } catch (err) {
      this.emit('error',err);
      return console.error(err);
    }
    const length = parseInt(size / SINGLE);
    this.emit('file_start',name,file,length);
    console.log(`已找到视频文件${name}，分${length}片下载`);
    for (let i = 0; i < length; i++) {
      let start = i * SINGLE;
      let end = i == length ? (i + 1) * SINGLE - 1 : size - 1;
      let header_p = Object.assign({ 'Range': `bytes=${start}-${end}` }, haeders)
      let stream = fs.createWriteStream(file, { start, end });
      stream.on('finish', () => {
        console.log(`文件-${name}p${i}写入成功`);
        finishNum++;
        this.emit('p_finished',name,i,file,length);
        if (finishNum === length) {
          console.log(`文件-${name}全部传输完成`);
          this.emit('file_finished',name,file,length);
        }
      })
      this.emit('p_start',name,i,file,length);
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

    return this
  }
}