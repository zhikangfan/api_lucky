const Service = require('egg').Service;

class PrizeService extends Service {

  async getAll(userId, bindUserId) {
    const Op = this.app.Sequelize.Op;
    return this.ctx.model.Prize.findAll({
      where: {
        [Op.and]: [
          { status: true },
          {
            [Op.or]: [{ creator_id: userId }, { creator_id: bindUserId || null }],
          },
        ],

      },
      include: [
        {
          model: this.ctx.model.User,
          as: 'creator',
          attributes: [ 'id', 'nickname', 'account' ],
        },
      ],
    });
  }

  async addPrize(params) {
    return this.ctx.model.Prize.create(params);
  }

  async removePrize(pid) {
    return this.ctx.model.Prize.update({
      status: false,
    }, {
      where: {
        id: pid,
      },
    });
  }

  async updatePrize(pid, params) {
    return this.ctx.model.Prize.update(params, {
      where: {
        id: pid,
      },
    });
  }

  async findPrizeByName(name) {
    return this.ctx.model.Prize.findOne({
      where: {
        name,
      },
    });
  }

  async findPrizeByPid(pid) {
    return this.ctx.model.Prize.findOne({
      where: {
        id: pid,
      },
    });
  }
}

module.exports = PrizeService;
