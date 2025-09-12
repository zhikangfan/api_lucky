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
    preInvitationLink: 'http://47.101.31.109/',
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
    // origin(ctx) { // 设置允许来自指定域名请求
    //   const whiteList = [ 'http://10.30.8.67:5173', 'http://192.168.31.11:5173' ];
    //   const url = ctx.request.header.origin;
    //   if (whiteList.includes(url)) {
    //     return url;
    //   }
    //   return 'http://localhost:5173'; // 默认允许本地请求可跨域
    // },
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true, // 允许跨域请求携带cookies
  };
  // Session配置
  config.session = {
    key: 'LUCKY_SESS',
    maxAge: 7 * 24 * 3600 * 1000, // 7*24小时
    httpOnly: true,
    encrypt: true,
    renew: true, // 自动刷新session
  };
  config.redis = {
    client: {
      port: 6379,
      host: '47.101.31.109',
      password: 'P@ssw0rd@2025',
      db: 0,
    },
  };
  // 数据库配置
  config.sequelize = {
    dialect: 'mysql',
    host: '47.101.31.109',
    port: 3306,
    database: 'lucky',
    username: 'zhikang',
    password: 'P@ssw0rd@2025',
  };
  return {
    ...config,
    ...userConfig,
  };
};
