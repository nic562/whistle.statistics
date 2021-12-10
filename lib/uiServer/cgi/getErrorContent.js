const fs = require('fs');
const path = require('path');

const readErrorLogContent = (fileName) => {
  return new Promise((resolve) => {
    let p = path.join(__dirname, '../../../logs')
    fs.readdir(p, (err, files) => {
      if (err) {
        console.error('readErrorLogContent error:', err)
        resolve({ec: 1, em: err});
      } else {
        try {
          files.forEach((f, _) => {
            if (f === fileName) {
              fs.readFile(path.join(p, f), 'utf8', function (_err, data) {
                if (_err) {
                  console.error('readErrorLogContent read file error:', _err)
                  resolve({ec: 3, em: _err});
                } else {
                  resolve({ec: 0, content: data});
                }
              })
              throw new Error('End')
            }
          })
        } catch (e) {
          if (e.message !== 'End') {
            resolve({ec: 2, em: e});
          }
        }
      }
    });
  });
}

module.exports = async (ctx) => {
  let {file} = ctx.request.query;
  ctx.body = await readErrorLogContent(file);
};

