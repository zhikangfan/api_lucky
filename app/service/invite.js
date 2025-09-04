const Service = require('egg').Service;

class InviteService extends Service {
  async addInviteLink(options) {
    return this.ctx.model.InviteLink.create(options);
  }
  async findInviteLink(id) {
    return this.ctx.model.InviteLink.findOne({
      where: {
        id,
      },
    });
  }
  async dropInviteLink(id) {
    return this.ctx.model.InviteLink.update({ status: false }, {
      where: {
        id,
      },
    });
  }
}
module.exports = InviteService;
