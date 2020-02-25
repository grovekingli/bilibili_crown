/**
 * Module dependencies
 */
const path = require('path');
const puppeteer = require('puppeteer-core');
const config = require('../../crown_config');
const pathHandler = require('./pathHandler');

// 本地chrome路径
const chromePath = config.chromePath;


// 有头无头模式
const IS_HEADLESS = false;

const getHeaders = (vPath) => {
  if (typeof vPath !== 'string') throw new TypeError('vPath must be a string!');
  return new Promise((resolve, reject) => {
    req(vPath, (...args) => { resolve(...args) }, (...args) => { reject(...args) });
  });
};

const req = async (url, onSuccess, onError) => {
  if (typeof url !== 'string') throw new TypeError('url must be a string!');
  if (typeof onSuccess !== 'function') throw new TypeError('onSuccess callback must be a function!');
  if (typeof onError !== 'function') throw new TypeError('onError callback must be a function!');

  try {
    const browser = await puppeteer.launch({ headless: IS_HEADLESS, executablePath: chromePath });
    // headless 有头/无头模式
    // 无头模式就是后台运行，前端不显示;headless: false就是有头模式，就会显示浏览器
    const page = await browser.newPage();
    let headerArr = [];
    let headerObj = {};

    page.on('response', response => {
      let reqUrl = response.url(); 
      let header = response.headers();
      if (header.hasOwnProperty('content-range')) {

        let avName = pathHandler(reqUrl);
        if(!headerObj.hasOwnProperty(avName)&&avName){
          headerObj[avName] = true;
          headerArr.push({
            name:avName,
            url: reqUrl,
            header:JSON.parse(JSON.stringify(header)),
          });
        }
      }
    });

    await page.goto(url);
    await page.waitFor(5000);
    await browser.close();
    onSuccess(headerArr);
  } catch (e) {
    onError(e)
  }
};

module.exports = getHeaders;