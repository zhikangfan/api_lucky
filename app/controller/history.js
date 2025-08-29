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
      const task = list.map(history => ctx.service.prize.findPrizeByPid(history.prizeId));
      const taskInfo = await Promise.allSettled(task);
      // console.log(prizeInfoArray,'-')
      const data = list.map(history => {
        const prize = taskInfo.find(task => task.value.pid === history.prizeId);
        return {
          ...history,
          prize: prize.value,
        };
      });

      this.success(data);
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
        name,
      });
      this.success();
    } catch (e) {

      console.log(e);
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
      if (!target || !target.hid) {
        this.fail({
          code: 400,
          msg: '历史记录不存在',
        });
        return;
      }
      if (target.status) {
        this.fail({
          code: 400,
          msg: '已核销',
        });
        return;
      }
      await ctx.service.history.updateHistory(hid, {
        status: true,
        writeOffOperatorUid: uid, // 核销者
      });
      this.success();
    } catch (e) {
      this.fail('核销失败');
    }
  }
}

module.exports = HistoryController;
