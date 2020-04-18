## b站视频爬取项目
对b站视频资源的下载插件  
### 必须本地安装chrome应用
### 默认无头模式启动
### 启动文件: app.js
### 项目配置文件: crown_config.js
### 如果遇到下载失败去改一下./src/download/manger.js 40行的header；一般要修改Host和Referer两个地方，因为这个东西，b站一直在变的