BILIBILI CROWN
======
### 简介
该项目是基于node.js的针对某站视频资源的下载程序
### 需要安装的环境
Mac windows都:accept:<br>
node v8.9.4以上<br>
puppeteer-core<br>
本地安装chrome浏览器<br>
### 启动方式
启动文件: server.js<br>
控制台用node启动 server.js即可:<br>
`
node server.js
`
### 默认选项
项目配置文件:crown_config.js<br>
<br>
默认无头模式启动<br>
chrome默认路径为mac系统下的路径<br>
默认端口号: 2031<br>
默认下载在<br>
### 常见问题
Q1: 请求头获取失败<br>
A1: 如果遇到下载失败去改一下./src/download/manger.js 40行的header；一般要修改Host和Referer两个地方，因为这个东西，b站一直在变的<br>

