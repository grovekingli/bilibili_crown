class PubSub {
  /**
   * 发布/订阅器
   */

   /**
   * 初始化'发布/订阅器'类
   */
  constructor() {
    this.handles = {};
  }

  /**
   * 添加监听事件
   * @param {String} [eventType] 事件名
   * @param {function} [handle] 回调函数
   */
  listen(eventType, handle) {
    if (typeof eventType !== 'string') throw new TypeError('eventType must be a string!');
    if (typeof handle !== 'function') throw new TypeError('callback must be a function!');
    if (!this.handles.hasOwnProperty(eventType)) {
      this.handles[eventType] = [];
    }

    this.handles[eventType].push(handle);
    return this;
  }

  /**
   * 触发事件
   * @param {String} [eventType] 事件名 
   */
  emit(eventType, ...args) {
    if (typeof eventType !== 'string') throw new TypeError('eventType must be a string!');
    if (this.handles.hasOwnProperty(eventType)) {
      this.handles[eventType].forEach(item => {
        item.apply(null, args);
      });
    } 
    // else {
    //   throw new Error(`${eventType}unregistered`);
    // }

    return this;
  };

  /**
   * 删除监听事件
   * @param {String} [eventType] 事件名
   * @param {function} [handle] 回调函数
   */
  off(eventType, handle) {
    if (typeof eventType !== 'string') throw new TypeError('eventType must be a string!');
    if (typeof handle !== 'function') throw new TypeError('callback must be a function!');
    if (this.handles.hasOwnProperty(eventType)) {
      this.handles[eventType].forEach((item, i, array) => {
        if (item == handle) {
          array.splice(i, 1)
        }
      });
    } else {
      throw new Error(`"${eventType}"unregistered`);
    }

    this.handles[eventType].push(handle);
    return this;
  }
}

module.exports = PubSub