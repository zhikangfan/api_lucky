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
  async updateHistory() {
    try {
      const { ctx } = this;
      const uid = ctx.session.userId;
      const { hid } = ctx.request.body;
      const target = await ctx.service.history.findHistory(hid);
      if (!target) {
        this.fail({
          code: 400,
          msg: '无效卡',
        });
        return;
      }
      if (target.write_off) {
        this.fail({
          code: 400,
          msg: '已核销',
        });
        return;
      }
      const userInfo = await ctx.service.user.findUser(uid);
      if (userInfo.id === target.user_id) {
        this.fail({
          code: 400,
          msg: '自己无法核销',
        });
        return;
      }
      // 如果核销者与绑定人有关系，则可以核销
      if (userInfo.companion !== target.user_id) {
        this.fail({
          code: 400,
          msg: '非绑定关系无法核销',
        });
        return;
      }
      await ctx.service.history.updateHistory(hid, {
        write_off: true,
      });
      this.success();
    } catch (e) {
      this.fail('核销失败');
    }
  }
}

module.exports = HistoryController;
