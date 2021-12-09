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
  let reqCount = 0
  const sessions = [];
  let timer;

  const cleanSessions = () => {
    if (sessions.length > 0) {
      sessions.splice(0, sessions.length);
      reqCount = 0;
    }
  }

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
      cleanSessions();
      apiArgs.form['items'] = JSON.stringify(items)
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

  const waitingWriteSessions = (args, seconds) => {
    if (reqCount === sessions.length) {
      writeSessions(args);
    } else {
      console.warn('Waiting to upload sessions but Ending-Request count not match:', reqCount, '?', sessions.length);
      setTimeout( ()=> {
        waitingWriteSessions(args, seconds);
      }, seconds * 1000);
    }
  }

  updateFilter(storage.getProperty('filterText'));

  server.on('request', (req) => {
    // filter
    if (!storage.getProperty('active')) {
      cleanSessions();
      return;
    }
    let args = storage.getProperty('uploadArgs');
    if (!args || typeof args !== 'string') {
      cleanSessions();
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
    reqCount += 1;
    req.getSession((s) => {
      if (!s) {
        reqCount -= 1;
        return;
      }
      sessions.push(s);
      if (storage.getProperty('active') && !timer) {
        timer = setTimeout(() => {
          if (storage.getProperty('autoStop')) {
            storage.setProperty('active', 0)
          }
          waitingWriteSessions(args, 5);
          timer = undefined;
        }, timeout_s * 1000);
      }
    });
  });
};
