const fs = require('fs');
const path = require('path');

const clearErrorLog = () => {
  return new Promise((resolve) => {
    let p = path.join(__dirname, '../../../logsErr')
    fs.readdir(p, (err, files) => {
      if (err) {
        console.error('clearError error:', err)
        resolve({ec: 1, em: err});
      } else {
        files.forEach((f, _) => {
          if (f.indexOf('.log') !== -1) {
            fs.unlinkSync(path.join(p, f))
          }
        })
        resolve({ec: 0});
      }
    });
  });
}
module.exports = async (ctx) => {
  ctx.body = await clearErrorLog();
};

