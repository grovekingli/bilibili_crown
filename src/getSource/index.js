/**
 * Module dependencies
 */
const getHeaders = require('./getHeaders');
const diff = require('./diff');
const hack = require('./hack');
const PubSub = require('../../pubSub')

const getSource = (path) => {
  if (typeof path !== 'string') throw new TypeError('path must be a string!');
  return new Promise((resolve, reject) => {
    getHeaders(path).then(
      res => {
        if(!res||!res.length){
          console.log('header not enough')
          console.log(res)
          reject('header not enough')
        }else if(res.length===1){
          res = hack(res);
          console.log(res)
        }
        let videoInfoArr = diff(res);
        // let fileHeadersObj = diff(headers);
        // console.log(fileHeadersObj)
        resolve(videoInfoArr);
      },
      err => {
        console.log(err)
        reject(err)
      })
  })
};

module.exports = getSource;