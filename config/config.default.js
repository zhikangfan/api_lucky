/* eslint valid-jsdoc: "off" */
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1756187832426_8004';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    prizeDataPath: path.join(__dirname, '../data/prize.json'),
    historyDataPath: path.join(__dirname, '../data/history.json'),
    userDataPath: path.join(__dirname, '../data/user.json'),
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [],
  };
  // 配置跨域允许访问的IP地址
  config.cors = {
    credentials: true, // 允许跨域请求携带cookies
    origin: ctx => {
      return ctx.request.header.origin;
    },
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  // Session配置
  config.session = {
    key: 'LUCKY_SESS',
    maxAge: 24 * 3600 * 1000, // 24小时
    httpOnly: true,
    encrypt: true,
  };
  return {
    ...config,
    ...userConfig,
  };
};
