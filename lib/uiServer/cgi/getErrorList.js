const fs = require('fs');
const path = require('path');

const readErrorLogList = () => {
  return new Promise((resolve) => {
    fs.readdir(path.join(__dirname, '../../../logs'), (err, files) => {
      if (err) {
        console.error('readErrorLogList error:', err)
        resolve({ec: 1, em: err});
      } else {
        files.splice(files.indexOf('README.md'), 1)
        resolve({ec: 0, files: files});
      }
    });
  });
}
module.exports = async (ctx) => {
  ctx.body = await readErrorLogList();
};

