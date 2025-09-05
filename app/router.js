/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/user/login', controller.user.login);
  router.get('/user/profile', app.middleware.auth(), app.middleware.auth(), controller.user.getProfile);
  router.post('/user/update', app.middleware.auth(), controller.user.updateProfile);
  router.post('/user/addCount', app.middleware.auth(), controller.user.addCount);
  router.post('/user/logout', app.middleware.auth(), controller.user.logout);
  router.post('/user/register', controller.user.register);
  router.get('/user/bindQRCode', app.middleware.auth(), controller.user.generateBindQRCode);
  router.get('/user/bindCheck', app.middleware.auth(), controller.user.bindCheck);
  router.get('/user/addCountQRCode', app.middleware.auth(), controller.user.generateAddCountQRCode);
  router.get('/user/addCountCheck', app.middleware.auth(), controller.user.addCountCheck);
  router.post('/user/bind', app.middleware.auth(), controller.user.bind);
  router.post('/user/unbind', app.middleware.auth(), controller.user.unbind);
  router.post('/user/remove', app.middleware.auth(), controller.user.remove);
  router.get('/history/list', app.middleware.auth(), controller.history.getHistoryList);
  router.post('/history/add', app.middleware.auth(), controller.history.addHistory);
  router.post('/history/update', app.middleware.auth(), controller.history.updateHistory);
  router.get('/prize/list', app.middleware.auth(), controller.prize.getList);
  router.post('/prize/add', app.middleware.auth(), controller.prize.add);
  router.post('/prize/update', app.middleware.auth(), controller.prize.update);
  router.post('/prize/remove', app.middleware.auth(), controller.prize.remove);
};
