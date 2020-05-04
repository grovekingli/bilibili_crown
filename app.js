const BCrown = require('./index');
const path = require('path');
let onError = (e) => {
  console.log(e)
  return false;
};

let bCrown = new BCrown(path.join(__dirname, './download'));
bCrown
  .listen('start', (...args) => {
    console.log(args[0], ' - 开始')
  })
  .listen('falsified', (...args) => {
    console.log(args[0], ' - 资源url伪造完成')
  })
  .listen('downloadTaskMounted', (...args) => {
    console.log(args[0], ` - 下载任务已挂载 有${args[1]}个任务`)
    let downloadTasks = args[2];
    // 单个下载任务进行监听
    downloadTasks.forEach(task => {
      let finished = 0;
      task
        .listen('file_start', (name, file, length) => {
          console.log(`已找到视频文件${name}，分${length}片下载`);
          console.log(`下载地址:${file}`);
        })
        .listen('p_start', (name, i, file, length) => {
          // console.log(`视频文件${name}第${i+1}片(total:${length})开始下载`);
          // console.log(`下载地址:${file}`);
        })
        .listen('p_finished', (name, i, file, length) => {
          finished++;
          console.log(`视频文件"${name}"第${i + 1}片下载完成 - 下载进度:${finished}/${length}`);
          // console.log(`下载地址:${file}`);
        })
    });
  })
  .listen('downloaded', (...args) => {
    console.log(args[0], ` - 所有下载任务完成 成功:${args[1]} 失败:${args[2]}`)
  })
  .listen('finished', (...args) => {
    console.log('finished')
  })
  .listen('error', (status, e) => {
    onError(e)
  });
bCrown.fetch('https://www.bilibili.com/video/BV1j4411W7F7');

// module.exports = {
//   bcrownGet(avNo) {
//     if (typeof avNo !== 'string') throw new TypeError('avNo must be a string!');
//     bCrown.fetch(`https://www.bilibili.com/video/${avNo}`);
//   }
// };