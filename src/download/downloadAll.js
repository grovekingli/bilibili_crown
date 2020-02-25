/**
 * Module dependencies
 */
const downloadOne = require('./download')
const getSize = require('./getSize')

/**
 * 下载多个视频
 * @param {Array} [avArr] 需要下载的视频列表
 * @param {String} [item.name] 文件名
 * @param {String} [item.url] 资源链接
 * @param {String} [item.filePath] 指定输出文件的目录
 * @param {Number} [item.size] 文件大小
 */
module.exports = (avArr)=>{
  avArr.forEach(video => {
    downloadOne(video.name,video.url,video.filePath,video.size);
  });
}