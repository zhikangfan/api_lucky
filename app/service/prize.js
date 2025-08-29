const Service = require('egg').Service;

class PrizeService extends Service {
  async getAll() {
    return this.ctx.model.Prize.findAll();
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
