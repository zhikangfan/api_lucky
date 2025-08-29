const { Controller } = require('egg');

class HistoryController extends Controller {
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
      const { prizeId, name } = ctx.request.body;
      const target = await ctx.service.prize.findPrizeByPid(prizeId);
      if (!target) {
        this.fail({
          msg: '该奖品不存在',
        });
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
          msg: '历史记录不存在',
        });
        return;
      }
      if (target.dataValues.write_off) {
        this.fail({
          code: 400,
          msg: '已核销',
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
