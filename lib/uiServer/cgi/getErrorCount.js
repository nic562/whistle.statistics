const fs = require('fs');
const path = require('path');

const readErrorLogCount = () => {
  return new Promise((resolve) => {
    fs.readdir(path.join(__dirname, '../../../logsErr'), (err, files) => {
      if (err) {
        console.error('readErrorLogCount error:', err)
        resolve({ec: 1, em: err});
      } else {
        resolve({ec: 0, count: files.length-1});
      }
    });
  });
}
module.exports = async (ctx) => {
  ctx.body = await readErrorLogCount();
};

