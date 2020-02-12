// require module
const FFmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

// global
const commandName = '混流操作';
const video_p = path.join(__dirname, './video_assets/video_2.mp4');
const sound_p = path.join(__dirname, './video_assets/video_1.mp3');
const output_p = path.join(__dirname, './video_assets/output.mp4');

// mainFun
/**
 * 
 * @param {*} next 回调函数
 */
const f = (next)=>{
  let command = new FFmpeg({ source: video_p })
  .addInput(sound_p)
  .on('start', function (commandLine) {
    console.log('开始' + commandName);
  })
  .on('progress', function (progress) {
    let percent = parseInt(progress.percent);
    console.log(`正在进行${command}...` + percent + '%');
  })
  .on('error', function (err) {
    console.log(commandName + '错误');
    console.log('ERROR: ' + err);
    if(next){
      next(err);
    }
  })
  .on('end', function () {
    const sucMsg = 'mix success!';
    const file = output_p;
    console.log('完成' + commandName);
    if(next){
      next({
        msg:sucMsg,
        file
      });
    }
  })
  .saveToFile(output_p);
};

module.exports = f;