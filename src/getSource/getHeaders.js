/**
 * Module dependencies
 */
const puppeteer = require('puppeteer-core');
const config = require('../../crown_config');
const pathHandler = require('./pathHandler');

// 本地chrome路径
const chromePath = config.chromePath;


// 有头/无头模式
const IS_HEADLESS = true;

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
    let canClose = false;
    await page.setRequestInterception(true);

    page.on('request', request => {
      request.continue();
      let reqUrl = request.url();
      let header = request.headers();
      if (header.hasOwnProperty('range')) {

        let avName = pathHandler(reqUrl);
        if (!headerObj.hasOwnProperty(avName) && avName) {
          headerObj[avName] = true;
          console.log(header)
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

    await page.goto(url);

    let videoBtn = await page.$('video');
    await page.click('video');

    await page.waitForFunction((flag) => {
      return flag
    }, { timeout: 10000 }, canClose);
    await browser.close();
    console.log(headerArr)
    onSuccess(headerArr);
  } catch (e) {
    onError(e)
  }
};

module.exports = getHeaders;