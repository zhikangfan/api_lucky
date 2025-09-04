/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = () => {
  const userConfig = {
    preInvitationLink: 'http://192.168.31.11:5173/invite',
  };
  return {
    ...userConfig,
  };
};
