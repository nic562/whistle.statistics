
[@Whistle](https://github.com/avwo/whistle) 的插件 **whistle.statistics**

### 用于将抓包数据上传到自定义服务器接口

#### 修改配置的接口
* POST /plugin.statistics/cgi-bin/set-settings
  - **autoStop**: 1 or 0 是否自动停止 
  - **timeout**: 默认10 秒，自动停止的计时时长 
  - **uploadArgs**: 自定义上传接口参数，json格式

#### 激活收集数据的接口
* POST /plugin.statistics/cgi-bin/active 
  - **active**: 1 or 0  是否激活
