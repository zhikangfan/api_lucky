const { Controller } = require('egg');
const crypto = require('crypto');

class UserController extends Controller {
  success(data) {
    this.ctx.body = {
      code: 200,
      msg: 'success',
      data,
    };
  }

  fail({ code, msg }) {
    this.ctx.body = {
      code: code || 500,
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
      if (!user || user.password !== hashedPassword) {
        this.fail({
          code: 400,
          msg: '账号或密码错误',
        });
        return;
      }
      // 设置session
      ctx.session.userId = user.id;
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
      if (!target) {
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

  async bind() {
    try {
      const { ctx } = this;
      const uid = ctx.session.userId;
      const { bindUserId } = this.ctx.request.body;
      const origin = await ctx.service.user.findUser(uid);
      if (origin.companion) {
        this.fail({
          code: 400,
          msg: '账号已绑定其它账号',
        });
        return;
      }
      const target = await ctx.service.user.findUser(bindUserId);
      if (!target) {
        this.fail({
          code: 400,
          msg: '用户不存在',
        });
        return;
      }
      if (target.companion) {
        this.fail({
          code: 400,
          msg: '该用户已被绑定',
        });
        return;
      }
      if (uid === bindUserId) {
        this.fail({
          code: 400,
          msg: '无法绑定自己账号',
        });
        return;
      }
      await ctx.service.user.bindUser(uid, bindUserId);
      this.success();
    } catch (e) {
      this.fail('绑定失败');
    }
  }
  async unbind() {
    try {
      const { ctx } = this;
      const uid = ctx.session.userId;
      const origin = await ctx.service.user.findUser(uid);
      if (!origin.companion) {
        this.fail({
          code: 400,
          msg: '账号未绑定其它账号',
        });
        return;
      }
      await ctx.service.user.unbindUser(uid, origin.companion);
      this.success();
    } catch (e) {
      this.fail('解除绑定失败');
    }
  }

  async addCount() {
      try {
        const { ctx } = this;
        const uid = ctx.session.userId;
        const { inviter } = this.ctx.request.body;
        const userInfo = await this.ctx.service.user.findUser(uid);
        const origin = await ctx.service.user.findUser(inviter);
        if (!origin) {
          this.fail({
            code: 400,
            msg: '用户不存在',
          });
          return;
        }
        if (inviter === uid) {
            this.fail({
              code: 400,
              msg: '自己无法添加抽奖次数',
            });
            return
        }
        if (userInfo.companion !== inviter) {
            this.fail({
                code: 400,
                msg: '非绑定用户无法添加抽奖次数',
            })
            return
        }

        await ctx.service.user.updateUser(inviter, {
            lottery_chances: origin.lottery_chances + 1
        });
        this.success();
      } catch (e) {
          console.log(e)
        this.fail('添加失败');
      }
  }
}

module.exports = UserController;
