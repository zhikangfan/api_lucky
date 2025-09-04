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
      const uid = this.ctx.session.userId;
      const userInfo = await this.ctx.service.user.findUser(uid);
      const data = await service.prize.getAll(uid, userInfo.companion);
      this.success(data);
    } catch (e) {
      console.log(e);
      this.fail('查询失败');
    }
  }

  async update() {
    try {
      const { service } = this;
      const { pid, ...others } = this.ctx.request.body;
      const uid = this.ctx.session.userId;
      const target = await service.prize.findPrizeByPid(pid);
      if (!target) {
        this.fail('该奖品不存在');
        return;
      }
      const userInfo = await this.ctx.service.user.findUser(uid);
      // 判断是否这张卡片是自己人创建的
      if (target.creator_id !== uid && target.creator_id !== userInfo.companion) {
        this.fail('没有权限');
        return;
      }
      const data = await service.prize.updatePrize(pid, others);
      this.success(data.dataValues);
    } catch (e) {
      this.fail('更新失败');
    }
  }

  async add() {
    try {
      const { service } = this;
      const uid = this.ctx.session.userId;
      const { chance, name, desc } = this.ctx.request.body;
      const target = await service.prize.findPrizeByName(name);
      if (!target) {
        const data = await service.prize.addPrize({ chance, name, desc, creator_id: uid });
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
      const uid = this.ctx.session.userId;
      if (!target) {
        this.fail('该奖品不存在');
        return;
      }
      const userInfo = await this.ctx.service.user.findUser(uid);
      // 判断是否这张卡片是自己人创建的
      if (target.creator_id !== uid && target.creator_id !== userInfo.companion) {
        this.fail('没有权限');
        return;
      }
      const data = await service.prize.removePrize(pid);
      this.success(data.dataValues);
    } catch (e) {
      this.fail('删除失败');
    }
  }
}

module.exports = PrizeController;
