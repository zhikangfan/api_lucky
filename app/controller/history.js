const { Controller } = require('egg');

class HistoryController extends Controller {
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
  async getHistoryList() {
    try {
      const { ctx } = this;
      const uid = ctx.session.userId;
      const list = await ctx.service.history.getHistoryList(uid);
      this.success(list);
    } catch (e) {
      this.fail('获取历史记录失败');
    }
  }
  async addHistory() {
    try {
      const { ctx } = this;
      const uid = ctx.session.userId;
      const { prizeId } = ctx.request.body;
      const target = await ctx.service.prize.findPrizeByPid(prizeId);
      if (!target) {
        this.fail({
          msg: '该奖品不存在',
        });
        return;
      }
      await ctx.service.history.addHistory({
        uid,
        prizeId,
      });
      this.success();
    } catch (e) {
      this.fail({
        msg: '添加历史记录失败',
      });
    }
  }

  async generateWriteOffQRCode() {
    try {
      const { ctx } = this;
      const uid = ctx.session.userId;
      const { hid } = ctx.request.query;
      const type = 2; // 0: 绑定 1: 抽奖 2:核销中奖卡片
      const expires = 5 * 60;
      const target = await this.ctx.service.history.findHistory(hid);
      if (!target) {
        this.fail({
          msg: '该奖励不存在',
        });
        return;
      }
      if (target.write_off) {
        this.fail({
          msg: '该奖励已核销',
        });
        return;
      }
      const { key, link } = await this.ctx.service.invite.addInviteLink({
        inviter: uid,
        hid,
        prizeName: target?.prize?.name,
        type,
        expires,
      });
      this.success({
        qid: key,
        src: link,
      });
    } catch (e) {
      this.fail({
        msg: '生成失败',
      });
    }
  }

  async writeOffCheck() {
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
        msg: '该链接不存在或已过期',
      });
      return;
    }
    this.success(JSON.parse(res));
  }
  async writeOffHistory() {
    try {
      const { ctx } = this;
      const uid = ctx.session.userId;
      const { qid } = ctx.request.body;
      const target = await this.ctx.service.invite.findInviteLink(qid);
      if (!target) {
        this.fail({
          msg: '该链接不存在或已过期',
        });
        return;
      }

      const parseTarget = JSON.parse(target);
      const user = await this.ctx.service.user.findUser(parseTarget?.inviter);
      if (!user) {
        this.fail({
          msg: '该用户不存在',
        });
        return;
      }
      if (parseTarget?.type !== 2) {
        this.fail({
          msg: '无效链接',
        });
        return;
      }
      const targetHistory = await ctx.service.history.findHistory(parseTarget.hid);
      if (!targetHistory) {
        this.fail({
          code: 400,
          msg: '无效卡',
        });
        return;
      }
      if (targetHistory.write_off) {
        this.fail({
          code: 400,
          msg: '已核销',
        });
        return;
      }
      const origin = await ctx.service.user.findUser(uid);
      if (origin.id === parseTarget?.inviter) {
        this.fail({
          code: 400,
          msg: '自己无法核销',
        });
        return;
      }
      // 如果核销者与绑定人有关系，则可以核销
      if (origin.companion !== parseTarget?.inviter) {
        this.fail({
          code: 400,
          msg: '非绑定关系无法核销',
        });
        return;
      }
      await ctx.service.history.updateHistory(parseTarget.hid, {
        write_off: true,
      });
      parseTarget.status = true;
      // 更新redis状态，并重新设置过期时间
      await this.ctx.service.invite.updateInviteLink(qid, parseTarget, 60);
      this.success();
    } catch (e) {
      this.fail({
        msg: '核销失败',
      });
    }
  }

}

module.exports = HistoryController;
