/**
 * Module dependencies
 */
const getSize = require('./getSize');
const downloadOne = require('./download')
const downloadAll = require('./downloadAll')
const path = require('path');


module.exports = (videoInfoArr,filePath)=>{
  if (!Array.isArray(videoInfoArr)) throw new TypeError('videoInfoArr must be a array!');
  if (typeof filePath !== 'string') throw new TypeError('av must be a string!');
  let downloadArr = [];
  videoInfoArr.forEach(videoInfo=>{
    let size = getSize(videoInfo.header);
    downloadArr.push({
      name:videoInfo.name,
      url:videoInfo.url,
      filePath,
      size
    });
  });
  downloadAll(downloadArr)
}