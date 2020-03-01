/**
 * 获取视频流文件方法
 * @param {string} url 视频资源的url
 */
module.exports = (url)=>{
  if (typeof url !== 'string') throw new TypeError('url must be a string!');
  
  let videoName = '';
  let matchArr = /\/(\w|\-)+(\.m4s)/.exec(url);
  if(matchArr&&matchArr[0]){
    videoName = matchArr[0].slice(1,-4)
  }
  
  return videoName;
}