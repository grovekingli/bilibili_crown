/**
 * Module dependencies
 */
const PubSub = require('./pubsub');
const getSource = require('./src/getSource');
const download = require('./src/download');
const path = require('path');

class BCrown extends PubSub{
  /**
   * '视频资源爬虫'类
   */

  /**
   * 初始化'视频资源爬虫'类
   * @param {String} [path] 指定输出文件的目录
   */
  constructor(path) {
    if (typeof path !== 'string') throw new TypeError('path must be a string!');

    super();
    // this.path = path ? path : path.join(__dirname, '../download');;
    this.path = path;
    this.progress = 'created';
  }

  /**
   * fetch 获取视频 对全局的一个封装 
   * @param {String} [av] 需要下载的视频
   * @param {String} [name] 指定视频文件名,default: 视频av号+时间戳
   * @param {String} [type] 视频类型,default：MP4
   */
  fetch(avUrl, name, type) {
    if (typeof avUrl !== 'string') throw new TypeError('av must be a string!');
    // TODO 动态指定文件类型
    // if (typeof type !== 'string') throw new TypeError('type must be a string!');
    // type = type ? type : 'mp4';
    type = 'mp4'
    name = name ? name.toString() : 'v' + '_' + Date.now();
    this.avUrl = avUrl;

    this.fetchVideo();

    // return this;
  }

  async fetchVideo(){
    try{
      this.onsStart()
      let reqObj = await this.fetchReq(this.avUrl);
      let fileObj = await this.download(reqObj);
      let resObj = await this.mix(fileObj.video,fileObj.sound);
      this.onFinish({...resObj});
    }catch(e){
      console.log(e)
      this.onerror(e)
    }
  }

  /**
   * 应用层
   */

  // 获得请求头
  fetchReq(avUrl){
    if (typeof avUrl !== 'string') throw new TypeError('avUrl must be a string!');
    this.progress = 'startFalsify';
    this.curryingEmit();

    let req = '';
    let url = '';
    let success = false;

    let callback = ()=>{
      req = 'fake req';
      url = 'http://fake.url';
      success = true;
      this.progress = 'falsified';
    };

    return new Promise((resolve,reject)=>{
      getSource(avUrl).then(res=>{
        callback();
        this.curryingEmit(res);
        resolve(res);
      },err=>{
        this.onerror(err);
      });
    });
  }
  
  // 下载
  download(videoInfoArr){
    this.progress = 'startDownload';
    this.curryingEmit();

    let video = '';
    let sound = '';
    let success = false;
    
    download(videoInfoArr,this.path);

    let callback = ()=>{
      video = 'dir/dir/video.mp4';
      sound = 'dir/dir/sound.mp3';
      success = true;
      this.progress = 'downloaded';
      this.curryingEmit(video,sound,success);
    };

    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        callback();
        resolve({video,sound,success});
      },500)
    });
  }

  // 混流
  mix(video,sound){
    this.progress = 'startMix';
    this.curryingEmit();

    let resFile = '';
    let success = false;

    let callback = ()=>{
      success = true;
      resFile = 'asdasd/asdad/file.mp4'
      this.progress = 'mixed';
      this.curryingEmit(resFile,success);
    };

    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        callback();
        resolve({resFile,success});
      },500)
    });
  }

  /**
   * 业务逻辑
   */
  // 请求
  req(){

  }

  //区分视频文件还是音频文件
  diff(){

  }

  curryingEmit(...args){
    let eventType = this.progress;
    if (this.handles.hasOwnProperty(eventType)) {
      this.emit(this.progress,this.progress,...args);
    }
  };

  onsStart(...args){
    this.progress = 'start';
    this.curryingEmit(...args);
  }

  onFinish(...args){
    this.progress = 'finished';
    this.curryingEmit(...args);
  }

  onerror(err) {
    this.progress = 'error'
    this.curryingEmit(err);
  }
}

module.exports = BCrown