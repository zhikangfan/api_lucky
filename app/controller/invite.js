const { Controller } = require('egg');

class InviteController extends Controller {
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

  /**
   * 生成邀请链接
   * @return {Promise<void>}
   */
  async generateInvitationLink() {
    try {
      const { ctx } = this;
      const uid = ctx.session.userId;
      const type = ctx.request.query.type || 0;
      const expires = ctx.request.query.expires || 5 * 60;
      const key = await this.ctx.service.invite.addInviteLink({
        inviter: uid,
        type,
        expires,
      });
      const link = `${ctx.app.config.preInvitationLink}?inviter=${uid}&type=${type}&qid=${key}`;
      this.success({
        qid: key,
        src: link,
      });
    } catch (e) {
      console.log(e);
      this.fail({
        msg: '生成失败',
      });
    }

  }

  /**
   * 核销
   * @return {Promise<void>}
   */
  async writeOff() {
    const { ctx } = this;
    const uid = ctx.session.userId;
    const { qid, inviter } = ctx.request.body;
    const target = await this.ctx.service.invite.findInviteLink(qid);
    if (!target) {
      this.fail({
        msg: '该链接不存在',
      });
      return;
    }
    const user = await this.ctx.service.user.findUser(inviter);
    if (!user) {
      this.fail({
        msg: '该用户不存在',
      });
      return;
    }
    if (user.companion !== uid) {
      this.fail({
        msg: '非绑定用户禁止核销',
      });
      return;
    }
    await this.ctx.service.invite.dropInviteLink(qid);
    this.success();
  }

  async check() {
    const { ctx } = this;
    const { qid } = ctx.request.query;
    if (!qid) {
      this.fail({
        code: 400,
        msg: '请传入qid',
      });
    }
    const res = await this.ctx.service.invite.findInviteLink(qid);
    if (!res) {
      this.fail({
        code: 400,
        msg: '该链接不存在',
      });
      return;
    }
    this.success(JSON.parse(res));
  }
}
module.exports = InviteController;
