/**
 * Module dependencies
 */
const puppeteer = require('puppeteer-core');
const config = require('../../crown_config');
const pathHandler = require('./pathHandler');

// 本地chrome路径
const chromePath = config.chromePath;


// 有头/无头模式
const IS_HEADLESS = config.isHeadLess;

/**
 * 获取视频资源的请求头信息
 * @param {string} link 需要获取的视频页面链接
 */
const getHeaders = (link) => {
  if (typeof link !== 'string') throw new TypeError('link must be a string!');
  return new Promise((resolve, reject) => {
    req(link, (...args) => { resolve(...args) }, (...args) => { reject(...args) });
  });
};

/**
 * 向指定的视频页面链接发送请求
 * @param {string} link 需要获取的视频页面链接 
 * @param {Function} onSuccess 成功的回调函数
 * @param {Function} onError 失败的回调函数
 */
const req = async (link, onSuccess, onError) => {
  if (typeof link !== 'string') throw new TypeError('link must be a string!');
  if (typeof onSuccess !== 'function') throw new TypeError('onSuccess callback must be a function!');
  if (typeof onError !== 'function') throw new TypeError('onError callback must be a function!');

  try {
    const browser = await puppeteer.launch({ headless: IS_HEADLESS, executablePath: chromePath });
    const page = await browser.newPage();
    let headerArr = [];
    let headerObj = {};
    let canClose = false;
    await page.setRequestInterception(true);

    page.on('request', request => {
      request.continue();
      let reqUrl = request.url();
      let header = request.headers();
      //console.log(header);
      if (header.hasOwnProperty('range')) {
        console.log(reqUrl,header)
        let avName = pathHandler(reqUrl);
        if (!headerObj.hasOwnProperty(avName) && avName) {
          headerObj[avName] = true;
          // console.log(header)
          headerArr.push({
            name: avName,
            url: reqUrl,
            header: JSON.parse(JSON.stringify(header)),
          });
          if (headerArr.length > 1) {
            canClose = true;
          }
        }
      }
    });

    await page.goto(link);

    await page.click('video');

    await page.waitForFunction((flag) => {
      return flag
    }, { timeout: 10000 }, canClose);
    await browser.close();
    // console.log(headerArr)
    onSuccess(headerArr);
  } catch (e) {
    onError(e)
  }
};

module.exports = getHeaders;