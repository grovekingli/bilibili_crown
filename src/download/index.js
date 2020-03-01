/**
 * Module dependencies
 */
const DownloadManger = require('./manager')


module.exports = (videoInfoArr, filePath) => {
  if (!Array.isArray(videoInfoArr)) throw new TypeError('videoInfoArr must be a array!');
  if (typeof filePath !== 'string') throw new TypeError('av must be a string!');
  let downloadArr = [];
  videoInfoArr.forEach(videoInfo => {
    downloadArr.push({
      name: videoInfo.name,
      url: videoInfo.url,
      filePath,
    });
  });
  // downloadAll(downloadArr)

  let downloadManger = new DownloadManger(downloadArr,filePath);
  return downloadManger.downloadAll();
}