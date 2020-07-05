BILIBILI CROWN
======
### 简介
该项目是基于node.js的针对某站视频资源的下载程序
### 需要安装的环境
Mac windows都可:accept:<br>
node v8.9.4以上<br>
### 必须本地安装chrome应用
### 默认无头模式启动
### 启动文件: server.js
### 项目配置文件: crown_config.js
### 如果遇到下载失败去改一下./src/download/manger.js 40行的header；一般要修改Host和Referer两个地方，因为这个东西，b站一直在变的