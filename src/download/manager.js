/**
 * Module dependencies
 */

const PubSub = require('../../pubsub');
const request = require('request');
const path = require('path');
const fs = require('fs');

class Downloader extends PubSub {
  /**
   * '视频下载器'类
   */

  /**
   * 初始化'视频资源爬虫'类
   * @param {string} name 文件名
   * @param {string} url 资源链接
   * @param {string} [filePath] 指定输出文件的目录
   */
  constructor(name, url, filePath) {
    if (typeof name !== 'string') throw new TypeError('name must be a string!');
    if (typeof url !== 'string') throw new TypeError('url must be a string!');
    super();
    this.name = name.toString();
    this.url = url.toString();
    this.filePath = filePath ? filePath.toString() : '';
  }

  /**
  * @param {string} [filePath] 指定输出文件的目录
  */
  download(filePath) {
    filePath = filePath ? filePath : this.filePath;
    if (typeof filePath !== 'string') throw new TypeError('path must be a string!');

    const url = this.url;
    const name = this.name;

    let headers = {
      'Range': 'bytes=0-1',
      'content-type': 'application/json',
      'Accept': '*/*',
      'Accept-Encoding': 'identity',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Connection': ' keep-alive',
      'Host': 'upos-hz-mirrorks3u.acgvideo.com',
      'Origin': 'https://www.bilibili.com',
      'Referer': 'https://www.bilibili.com/video/av20391272',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36'
    };

    request({
      method: 'GET',
      uri: url,
      headers
    }).on('response', (res, err) => {
      if (err) {
        this.emit('error', err);
        return console.error(err)
      };
      let size = 0;
      try{
        size = Number(res.headers['content-range'].split('/')[1]);
      }catch(e){
        return console.error(e)
      }
      const SINGLE = 1024 * 1000;
      const file = `${filePath}/${name}.mp4`;
      const length = parseInt(size / SINGLE);
      let finishNum = 0;

      try {
        fs.closeSync(fs.openSync(file, 'w'));
      } catch (err) {
        this.emit('error', err);
        return console.error(err);
      }
      this.emit('file_start', name, file, length);
      //console.log(`已找到视频文件${name}，分${length}片下载`);
      for (let i = 0; i < length; i++) {
        let start = i * SINGLE;
        let end = i == length ? (i + 1) * SINGLE - 1 : size - 1;
        let header_p = Object.assign(headers, { 'Range': `bytes=${start}-${end}` })
        let stream = fs.createWriteStream(file, { start, end });
        stream.on('finish', () => {
          //console.log(`文件-${name}p${i}写入成功`);
          finishNum++;
          this.emit('p_finished', name, i, file, length);
          if (finishNum === length) {
            // console.log(`文件-${name}全部传输完成`);
            this.emit('file_finished', name, file, length);
          }
        })
        this.emit('p_start', name, i, file, length);
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
    })

    return this
  }
}

class DownloadManger extends PubSub {
  /**
   * '视频下载管理'类
   */

  /**
   * 构造函数
   * @param {(Object|Object[])} videos 需要下载的视频列表
   * @param {string} videos[].name 文件名
   * @param {string} videos[].url 资源链接
   * @param {string} filePath 指定输出文件的目录
   */
  constructor(videos, filePath) {
    if (!Array.isArray(videos)) {
      videos = [].push(videos);
    }
    super();
    this.downloderArr = [];
    videos.forEach((video, i) => {
      if (typeof video.name !== 'string') throw new TypeError('video.name must be a string!');
      if (typeof video.url !== 'string') throw new TypeError('video.url must be a string!');

      let url = video.url;
      let name = video.name;
      this.downloderArr.push(new Downloader(name, url, filePath));
    });
    this.tasks = this.downloderArr;
    this.progress = 'created';
  };

  /**
   * 下载单个视频
   * @param {number|string} index 下载视频的序列号
   */
  downloadByIndex(index) {
    let downloader = this.downloderArr[index];
    return downloader.download();
  }

  /**
   * 下载管理器中的全部视频
   */
  downloadAll() {
    let length = this.downloderArr.length;
    let errorNum = 0;
    let downloadedNum = 0;
    let resArr = [];

    this.downloderArr.forEach((downloader, i, arr) => {
      this.downloadByIndex(i)
        .listen('error', (error) => {
          errorNum++;
          resArr.push({
            name: downloader.name,
            url: downloader.url,
            success: false,
            status_txt: error
          })

          if (downloadedNum + errorNum === length) {
            this.emit('all_file_finished', downloadedNum, errorNum, resArr);
          }
        })
        .listen('file_finished', (...args) => {
          downloadedNum++;
          resArr.push({
            name: downloader.name,
            url: downloader.url,
            success: true,
            status_txt: 'download'
          })

          if (downloadedNum + errorNum === length) {
            this.emit('all_file_finished', downloadedNum, errorNum, resArr);
          }
        })
    });

    return this;
  }
}

module.exports = DownloadManger;