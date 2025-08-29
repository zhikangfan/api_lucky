module.exports = app => {
  app.beforeStart(async () => {
    await app.model.sync({ force: false, alter: true }); // force为true时强制删除表并重建
  });
};
