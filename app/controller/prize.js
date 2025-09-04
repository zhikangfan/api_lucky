const { Controller } = require('egg');

class PrizeController extends Controller {
  success(data) {
    this.ctx.body = {
      code: 200,
      msg: 'success',
      data,
    };
  }

  fail(msg) {
    this.ctx.body = {
      code: 500,
      msg,
    };
  }

  async getList() {
    const { service } = this;
    try {
      const data = await service.prize.getAll();
      this.success(data);
    } catch (e) {
      this.fail('查询失败');
    }
  }

  async update() {
    try {
      const { service } = this;
      const { pid, ...others } = this.ctx.request.body;
      const target = await service.prize.findPrizeByPid(pid);
      if (!target) {
        this.fail('该奖品不存在');
      } else {
        const data = await service.prize.updatePrize(pid, others);
        this.success(data.dataValues);
      }
    } catch (e) {
      this.fail('更新失败');
    }
  }

  async add() {
    try {
      const { service } = this;
      const { chance, name, desc } = this.ctx.request.body;
      const target = await service.prize.findPrizeByName(name);
      if (!target) {
        const data = await service.prize.addPrize({ chance, name, desc });
        this.success(data.dataValues);
      } else {
        this.fail('该奖品已存在');
      }
    } catch (e) {
      this.fail('添加失败');
    }
  }

  async remove() {
    try {
      const { service } = this;
      const { pid } = this.ctx.request.body;
      const target = await service.prize.findPrizeByPid(pid);
      if (!target) {
        this.fail('该奖品不存在');
      } else {
        const data = await service.prize.removePrize(pid);
        this.success(data.dataValues);
      }
    } catch (e) {
      this.fail('删除失败');
    }
  }
}

module.exports = PrizeController;
