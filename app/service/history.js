const Service = require('egg').Service;

class HistoryService extends Service {
  async getHistoryList(uid) {
    return this.ctx.model.UserPrize.findAll({
      where: {
        user_id: uid,
      },
      include: [
        {
          model: this.ctx.model.Prize,
          as: 'prize',
        },
      ],
    });
  }

  async addHistory({ uid, prizeId }) {
    return this.ctx.model.UserPrize.create({
      user_id: uid,
      prize_id: prizeId,
    });
  }

  async updateHistory(hid, params) {
    return this.ctx.model.UserPrize.update(params, {
      where: {
        id: hid,
      },
    });
  }

  async findHistory(hid) {
    return this.ctx.model.UserPrize.findOne({
      where: {
        id: hid,
      },
    });
  }
}

module.exports = HistoryService;
