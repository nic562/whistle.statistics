const fs = require('fs');
const path = require('path');
const request = require('request');
const {check: checkFilter, update: updateFilter} = require('./filter');

const writeError = (msg) => {
  fs.writeFile(path.join(__dirname, '../logs', `error_${Date.now()}.log`), msg, (e) => {
    console.error(e)
  })
}

const writeSession = (session, args) => {
  try {
    let apiArgs = JSON.parse(args)
    apiArgs.form.method = session.req.method
    apiArgs.form.url = session.url
    apiArgs.form.status = session.res.statusCode
    apiArgs.form.duration = session.endTime - session.startTime
    apiArgs.form.raw = JSON.stringify(session, null, '  ')
    request(apiArgs, function (error, response, body) {
      if (error || response.statusCode >= 300) {
        console.warn(error, response.statusCode);
        writeError(body)
      }
    });
  } catch (e) {
    console.error(e)
    writeError(e)
  }
};

module.exports = (server, {storage}) => {
  let timer;

  updateFilter(storage.getProperty('filterText'));

  server.on('request', (req) => {
    // filter
    if (!storage.getProperty('active')) {
      return;
    }
    let args = storage.getProperty('uploadArgs');
    if (!args || typeof args !== 'string') {
      return;
    }
    if (!checkFilter(req.originalReq.url)) {
      return;
    }
    if (!timer && storage.getProperty('autoStop')) {
      let timeout_s = storage.getProperty('timeout');
      if (!timeout_s) {
        console.warn('`timeout` is invalid! Can not stop automatically!');
      } else {
        timer = setTimeout(() => {
          storage.setProperty('active', 0)
          timer = undefined
        }, timeout_s * 1000);
      }
    }
    req.getSession((s) => {
      if (!s) {
        return;
      }
      writeSession(s, args);
    });
  });
};
