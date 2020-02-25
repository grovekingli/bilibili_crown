const nameHash = {
  '30280': '30032',
  '30032': '30280'
};
const hack = (videoInfoArr) => {
  if (!Array.isArray(videoInfoArr)) throw new TypeError('headers must be a array!');
  if (videoInfoArr.length < 1) throw new TypeError('videoInfoArr length errors!');
  if (videoInfoArr.length > 1) { return videoInfoArr };

  try{
    let newName = '';
    let newObj = JSON.parse(JSON.stringify(videoInfoArr[0]));
    let oldName = videoInfoArr[0].name;
    let nameArr = oldName.split('-');

    nameArr[nameArr.length-1] = nameHash[nameArr[nameArr.length-1]]
    newName = nameArr.join('-');
    newObj.name = newName;

    videoInfoArr.push(newObj);
  }catch(e){
    console.log(e)
    return videoInfoArr
  }
};

module.exports = hack;
