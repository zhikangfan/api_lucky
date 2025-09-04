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
  async generateInvitationLink() {
    const { ctx } = this;
    const uid = ctx.session.userId;
    const { type = 0, expires = 5 * 60 } = ctx.request.body;
    const res = await this.ctx.service.invite.addInviteLink({
      inviter: uid,
      type,
      expires,
    });
    const link = `${ctx.app.config.preInvitationLink}?inviter=${uid}&type=${res.type}&qid=${res.id}`;
    this.success({
      qid: res.id,
      src: link,
    });
  }
  async writeOff() {
    const { ctx } = this;
    const uid = ctx.session.userId;
    const { pid, inviter } = ctx.request.body;
    const target = await this.ctx.service.invite.findInviteLink(pid);
    console.log(target);
    if (!target) {
      this.fail({
        msg: '该链接不存在',
      });
      return;
    }
    if (target.status) {
      this.fail({
        msg: '该链接已被使用',
      });
      return;
    }
    if (new Date(target.createAt).getTime() / 1000 > target.expires) {
      this.fail({
        msg: '该链接已过期',
      });
      return;
    }
    // TODO: 校验2人是否绑定
    await this.ctx.service.invite.dropInviteLink(pid);
    this.success();
  }

  async check() {
    const { ctx } = this;
    const { qid } = ctx.request.query;
    return await this.ctx.service.invite.findInviteLink(qid);
  }
}
module.exports = InviteController;
