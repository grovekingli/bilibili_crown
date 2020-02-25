module.exports = (header)=>{
  if (typeof header !== 'object') throw new TypeError('path must be a object!');

  const key = 'content-range';
  if(header[key]){
    let size = header[key].slice(header[key].indexOf('/')+1);
    return parseInt(size);
  }else{
    throw new TypeError('content-range not exist in header!');
  }
}