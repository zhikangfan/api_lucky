/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = () => {
  const userConfig = {
    // http://10.30.8.67:5173/
    // http://192.168.31.11:5173/
    preInvitationLink: 'http://10.30.8.67:5173/',
  };
  return {
    ...userConfig,
  };
};
