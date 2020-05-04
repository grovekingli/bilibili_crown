/**
 * Created by grovekingli on 2020/4/29.
 */
const BCrown = require('../index');
const pathModel = require('path');
const PubSub = require('../utlis/pubSub');
class SuperBCrown extends BCrown{
  constructor(id,info){
    let {path,videoName} = info;
    super(path);
    this.path = path;
    this.videoName = videoName;
    this.id = id;
    this.progressVal = 0;
    this.partNum = 0;
    this.finishPartNum = 0;

    this
        .listen('start', (...args) => {
          console.log(args[0], ' - 开始')
        })
        .listen('falsified', (...args) => {
          this.progressVal+=5;
          this._onProgressChange();
          console.log(args[0], ' - 资源url伪造完成')
        })
        .listen('downloadTaskMounted', (...args) => {
          console.log(args[0], ` - 下载任务已挂载 有${args[1]}个任务`);
          this.progressVal+=5;
          this._onProgressChange();
          let downloadTasks = args[2];
          // 单个下载任务进行监听
          downloadTasks.forEach(task => {
            let finished = 0;
            task
                .listen('file_start', (name, file, length) => {
                  this.partNum+=length;
                  console.log(`已找到视频文件${name}，分${length}片下载`);
                  // console.log(`下载地址:${file}`);
                })
                .listen('p_start', (name, i, file, length) => {
                  // console.log(`视频文件${name}第${i+1}片(total:${length})开始下载`);
                  // console.log(`下载地址:${file}`);
                })
                .listen('p_finished', (name, i, file, length) => {
                  finished++;
                  this.finishPartNum++;
                  let addProgress = (1/this.partNum)*90;
                  let progressVal = this.progressVal + addProgress;
                  this.progressVal = progressVal;
                  this._onProgressChange();
                  // console.log(`视频文件"${name}"第${i + 1}片下载完成 - 下载进度:${finished}/${length}`);
                  // console.log(`下载地址:${file}`);
                })
          });
        })
        .listen('downloaded', (...args) => {
          this.progressVal = 100.00;
          this._onProgressChange();
          console.log(args[0], ` - 所有下载任务完成 成功:${args[1]} 失败:${args[2]}`)
        })
        .listen('finished', (...args) => {
          console.log('finished')
        })
        .listen('error', (status, e) => {
          onError(e)
        });
  }

  _onProgressChange(){
    let videoName = this.videoName;
   if(this.progressChangeFn) {
     this.progressChangeFn(videoName,this.progressVal);
   }
   console.log(videoName,this.progressVal);
  }

  listenProgress(callback){
    this.progressChangeFn = callback;
  }
}

module.exports=(ws, req)=>{
  let downloadHash = {

  };
  const init = (user)=>{
    if(!downloadHash.user){
      downloadHash[user] = [];
    }
  };
  const getInfo = (user)=>{
    console.log(user)
  };
  const addVideoDownload = (user,video)=>{
    let addSuperBCrown = new SuperBCrown(video,{
      path:pathModel.join(__dirname, '../download'),
      videoName:video
    });
    let videoUrl = `https://www.bilibili.com/video/${video}`;
    addSuperBCrown.fetch(videoUrl);
    addSuperBCrown.listenProgress((video,val)=>{
      ws.send(JSON.stringify({
        type:11,
        data:{
          user,
          video,
          progress:val
        }
      }))
    });
    downloadHash[user].push(addSuperBCrown);
    console.log(user,video)
  };
  ws.on('message', function (msg) {
    let msgObj = JSON.parse(msg);
    let {type,data} = msgObj;
    switch (type){
      case 0:{
        init(data.user);
        getInfo(data.user);
        break;
      }
      case 1:{
        let {user,videos} = data;
        videos.forEach((video)=>{
          addVideoDownload(user,video)
        });
        break;
      }
      case 2:{
        let {user} = data;
        getInfo(user);
        break;
      }
    }
  });
  ws.send({type:-1,data:'info'})
};