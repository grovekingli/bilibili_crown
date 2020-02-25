/**
 * Module dependencies
 */

const diff = (videoInfoArr, type) => {
  if (!Array.isArray(videoInfoArr)) throw new TypeError('headers must be a array!');
  if (videoInfoArr.length < 2) throw new TypeError('headers length must longer than 2!');

  type = type ? type : 'diffByName'
  return diffHandlers[type](videoInfoArr);
};

const diffByName = (videoInfoArr) => {
  let keyWord = '30216';
  let res = JSON.parse(JSON.stringify(videoInfoArr));
  let deleteNum = 0;


  videoInfoArr.forEach((videoInfo, i, arr) => {
    if (typeof videoInfo.name !== 'string') throw new TypeError('videoInfo.name must be a array!');
    let name = videoInfo.name;
    let lastName = '';
    let nameArr = name.split('-')
    if (nameArr.length) {
      lastName = nameArr[nameArr.length - 1]
    }

    if (lastName === keyWord) {
      res.splice(i - deleteNum, 1);
      deleteNum++;
    }

  });

  console.log(res.length)
  return res.slice(0,2);
};

const diffBySize = (headers) => {
  const key = 'content-range';
  let headerSizeMap = {};
  let newHeaders = [];
  let res = {
    video: null,
    sound: null,
  };

  headers.forEach((item, i, arr) => {
    let header = item.header;
    let contentRange = header[key];
    let size = contentRange.slice(contentRange.indexOf('/'));
    headerSizeMap[size] = {
      url: arr[i].url,
      size: size
    };
  });

  Array.from(new Set(Object.keys(headerSizeMap)))
    .sort((a, b) => { return parseInt(b) - parseInt(a) })
    .forEach((i, size, arr) => {
      if (i > 0 && size != arr[i - 1] || i === 0) {
        newHeaders.push(headerSizeMap[size]);
      }
    });

  if (newHeaders.length > 1) {
    res.video = newHeaders[0];
    res.sound = newHeaders[1];
  }

  return res;
}

const diffHandlers = {
  diffByName,
  diffBySize
};

module.exports = diff;