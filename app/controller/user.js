const { Controller } = require('egg');
const crypto = require('crypto');

class UserController extends Controller {
  success(data) {
    this.ctx.body = {
      status: 200,
      msg: 'success',
      data,
    };
  }

  fail({ code, msg }) {
    this.ctx.body = {
      status: code || 500,
      msg,
    };
  }

  async login() {
    try {
      const { ctx } = this;
      const { account, password } = ctx.request.body;

      if (!account || !password) {
        this.fail({
          code: 400,
          msg: '账号和密码不能为空',
        });
        return;
      }

      // 密码加密
      const hashedPassword = crypto.createHash('sha256')
        .update(password)
        .digest('hex');
      // 查找用户
      const user = await ctx.service.user.findUserByAccount(account);
      if (!user || user.dataValues.password !== hashedPassword) {
        this.fail({
          code: 400,
          msg: '账号或密码错误',
        });
        return;
      }
      // 设置session
      ctx.session.userId = user.dataValues.id;
      const { password: pwd, ...info } = user.dataValues;
      this.success(info);
    } catch (e) {
      this.fail('登录失败');
    }
  }

  async getProfile() {
    const { ctx } = this;
    const target = await ctx.service.user.findUser(ctx.session.userId);
    if (!target) {
      this.fail({
        code: 400,
        msg: '用户不存在',
      });
      return;
    }
    this.success(target.dataValues);
  }

  async register() {
    try {
      const { ctx } = this;
      const { account } = this.ctx.request.body;
      const target = await ctx.service.user.findUserByAccount(account);
      if (!target) {
        const { nickname, password, account } = this.ctx.request.body;
        const hashedPassword = crypto.createHash('sha256')
          .update(password)
          .digest('hex');
        const result = await ctx.service.user.registerUser({
          nickname,
          account,
          password: hashedPassword,
        });
        const { password: pwd, ...info } = result.dataValues;
        this.success(info);
      } else {
        this.fail({
          code: 400,
          msg: '用户已存在',
        });
      }
    } catch (e) {
      this.fail('注册失败');
    }

  }

  async updateProfile() {
    try {
      const { ctx } = this;
      const uid = ctx.session.userId;
      const target = await ctx.service.user.findUser(uid);
      if (!target || !target.uid) {
        this.fail({
          code: 400,
          msg: '用户不存在',
        });
        return;
      }
      if (this.ctx.request.body.password) {
        this.ctx.request.body.password = crypto.createHash('sha256')
          .update(this.ctx.request.body.password)
          .digest('hex');
      } else {
        delete this.ctx.request.body.password;
      }
      await ctx.service.user.updateUser(uid, this.ctx.request.body);
      this.success();
    } catch (e) {
      this.fail('更新用户信息失败');
    }
  }

  async logout() {
    const { ctx } = this;
    // 清除session
    ctx.session = null;
    this.success();
  }

  async remove() {
    try {
      const { ctx } = this;
      const { uid } = this.ctx.request.body;
      const target = await ctx.service.user.findUser(uid);
      if (!target) {
        this.fail({
          code: 400,
          msg: '用户不存在',
        });
        return;
      }
      await ctx.service.user.removeUser(uid);
      this.success();
    } catch (e) {
      this.fail('删除用户失败');
    }
  }
}

module.exports = UserController;
