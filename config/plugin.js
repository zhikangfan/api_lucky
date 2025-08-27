/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  // 跨域问题
  cors: {
    enable: true,
    package: 'egg-cors',
  },
};
