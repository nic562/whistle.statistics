const getSettings = require('./getSettings');
const {update: updateFilter} = require('../../filter');

const checkArgs = (argStr) => {
  return new Promise((resolve) => {
    try {
      let js = JSON.parse(argStr);
      if (Object.keys(js).length === 0) {
        return resolve({
          ec: 2,
          em: '参数为空'
        });
      }
    } catch (e) {
      return resolve({
        ec: 3,
        em: '格式化JSON失败'
      });
    }
    resolve();
  });
};

module.exports = async (ctx) => {
  let {timeout, autoStop, uploadArgs, filterText} = ctx.request.body;
  try {
    timeout = parseInt(timeout)
  } catch (e) {
    timeout = 10
  }
  try {
    autoStop = parseInt(autoStop)
  } catch (e) {
    autoStop = 0
  }
  if (timeout <= 0) {
    ctx.body = {ec: 4, em: '计时秒数不合理'};
    return
  }
  if (typeof uploadArgs !== 'string') {
    uploadArgs = '{}';
  }
  if (uploadArgs) {
    const err = await checkArgs(uploadArgs);
    if (err) {
      ctx.body = err;
      return;
    }
  }
  const {localStorage} = ctx.req;
  updateFilter(filterText);
  localStorage.setProperty("timeout", timeout);
  localStorage.setProperty("autoStop", autoStop);
  localStorage.setProperty('uploadArgs', uploadArgs);
  localStorage.setProperty('filterText', typeof filterText === 'string' ? filterText : null);
  getSettings(ctx);
};
