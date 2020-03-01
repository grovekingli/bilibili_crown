/**
 * Module dependencies
 */
const getHeaders = require('./getHeaders');
const PubSub = require('../../utlis/pubSub');

const getSource = (path) => {
  if (typeof path !== 'string') throw new TypeError('path must be a string!');
  return new Promise((resolve, reject) => {
    getHeaders(path).then(
      res => {
        if(!res||!res.length){
          reject('header not enough')
        }
        videoInfoArr = res;
        resolve(videoInfoArr);
      },
      err => {
        reject(err)
      })
  })
};

module.exports = getSource;