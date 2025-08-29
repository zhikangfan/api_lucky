module.exports = (options, app) => {
  return async function auth(ctx, next) {
    // const token = ctx.get('Authorization');
    //
    // if (!token) {
    //   ctx.status = 401;
    //   ctx.body = {
    //     code: 401,
    //     message: '未提供认证令牌',
    //   };
    //   return;
    // }

    try {
      // 这里可以添加JWT验证逻辑
      // const decoded = jwt.verify(token, app.config.jwt.secret);
      // ctx.state.user = decoded;

      // 简单示例：从session获取用户信息
      const userId = ctx.session.userId;
      if (!userId) {
        ctx.body = {
          code: 401,
          message: '认证令牌无效',
        };
        return;
      }

      // 验证用户是否存在且状态正常
      const user = await ctx.service.user.findUser(userId);
      if (!user || !user.uid) {
        ctx.body = {
          code: 401,
          message: '用户不存在或已被禁用',
        };
        return;
      }

      ctx.state.user = user;
      await next();
    } catch (error) {
      ctx.body = {
        code: 401,
        message: '认证失败',
      };
    }
  };
};
