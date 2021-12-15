

## whistle.statistics 自定义统计抓包数据

基于 [@Whistle](https://github.com/avwo/whistle) 的插件

可将抓包获取的数据通过自定义接口和参数上传到指定服务器

安装方法：
```shell
npm install -g nic562/whistle.statistics
```

完成后便可在Whistle 的插件页中看到

## 以下接口可用于动态修改插件运行参数以及状态
#### 修改配置的接口
* POST /plugin.statistics/cgi-bin/set-settings
  - **autoStop**: 1 or 0 是否自动停止 
  - **timeout**: 默认10 秒，自动停止的计时时长 
  - **uploadArgs**: 自定义上传接口参数，json格式
    - form: 固定参数，以下参数会在上报指定接口时自动注入
      - method: 请求方式
      - url: 请求地址
      - status: 请求响应状态
      - duration: 请求持续时长
      - raw: 请求抓包完整信息(JSON格式的字符串)

#### 激活收集数据的接口
* POST /plugin.statistics/cgi-bin/active 
  - **active**: 1 or 0  是否激活
