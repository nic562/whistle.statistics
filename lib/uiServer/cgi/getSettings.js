module.exports = (ctx) => {
  const { localStorage } = ctx.req;
  ctx.body = {
    ec: 0,
    active: localStorage.getProperty('active'),
    timeout: localStorage.getProperty('timeout') || 10,
    autoStop: localStorage.getProperty('autoStop') || 0,
    uploadArgs: localStorage.getProperty('uploadArgs'),
    filterText: localStorage.getProperty('filterText'),
  };
};
