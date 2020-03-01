const BCrown = require('./index');
const path = require('path');

let bCrown = new BCrown(path.join(__dirname, './download'));
bCrown
.listen('start',(...args)=>{console.log('start')})
.listen('falsified',(...args)=>{console.log('falsified')})
.listen('downloaded',(...args)=>{console.log(...args)})
.listen('finished',(...args)=>{console.log('finished')});
bCrown.fetch('https://www.bilibili.com/video/av91996500')