/**
 * 获取视频流文件方法
 * @param {String} [url] 视频url
 */
module.exports = (url)=>{
  if (typeof url !== 'string') throw new TypeError('url must be a string!');
  
  let res = '';
  let matchArr = /\/(\w|\-)+(\.m4s)/.exec(url);
  if(matchArr&&matchArr[0]){
    res = matchArr[0].slice(1,-4)
  }
  
  return res;
}