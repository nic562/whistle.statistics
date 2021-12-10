const active = require('./cgi/active');
const getSettings = require('./cgi/getSettings');
const setSettings = require('./cgi/setSettings');
const getErrorCount = require('./cgi/getErrorCount');
const clearError = require('./cgi/clearError');
const getErrorList = require('./cgi/getErrorList');
const getErrorContent = require('./cgi/getErrorContent');

module.exports = (router) => {
  router.post('/cgi-bin/active', active);
  router.get('/cgi-bin/get-settings', getSettings);
  router.post('/cgi-bin/set-settings', setSettings);
  router.get('/cgi-bin/get-error-count', getErrorCount);
  router.get('/cgi-bin/clear-error', clearError);
  router.get('/cgi-bin/get-error-list', getErrorList);
  router.get('/cgi-bin/get-error', getErrorContent);
};
