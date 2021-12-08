const fs = require('fs');
const path = require('path');
const request = require('request');
const {check: checkFilter, update: updateFilter} = require('./filter');

const writeError = (msg) => {
  fs.writeFile(path.join(__dirname, '../logs', `error_${Date.now()}.log`), msg, (e) => {
    console.error(e)
  })
}

module.exports = (server, {storage}) => {
  const sessions = [];
  let timer;
  const writeSessions = (args) => {
    if (!sessions) {
      return
    }
    try {
      let apiArgs = JSON.parse(args)
      let items = []
      for (let i=0; i<sessions.length; i++) {
        let session = sessions[i];
        items.push({
          method: session.req.method,
          url: session.url,
          status: session.res.statusCode,
          duration: session.endTime - session.startTime,
          raw: JSON.stringify(session, null, '  ')
        })
      }
      apiArgs.form['items'] = JSON.stringify(items)
      request(apiArgs, function (error, response, body) {
        if (error || response.statusCode >= 300) {
          console.warn(error, response.statusCode);
          writeError(body)
        }
      });
      sessions.splice(0, sessions.length);
    } catch (e) {
      console.error(e)
      writeError(e)
    }
  };

  updateFilter(storage.getProperty('filterText'));

  server.on('request', (req) => {
    // filter
    let active = storage.getProperty('active');
    if (!active) {
      if (sessions.length > 0)
        sessions.splice(0, sessions.length);
      return;
    }
    let args = storage.getProperty('uploadArgs');
    if (!args || typeof args !== 'string') {
      return;
    }
    let timeout_s = storage.getProperty('timeout');
    if (!timeout_s) {
      console.warn('`timeout` is invalid!');
      return;
    }
    if (!checkFilter(req.originalReq.url)) {
      return;
    }
    req.getSession((s) => {
      if (!s) {
        return;
      }
      sessions.push(s);
      if (!timer) {
        timer = setTimeout(() => {
          writeSessions(args);
          timer = undefined;
        }, timeout_s * 1000);
      }
    });
  });
};
