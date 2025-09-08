const Service = require('egg').Service;
const { v4: uuidv4 } = require('uuid');
class InviteService extends Service {
  async addInviteLink({ inviter,
    type,
    expires,
    ...others
  }) {
    const key = uuidv4();
    await this.app.redis.set(key, JSON.stringify({ inviter, type, status: false, ...others }), 'EX', expires);
    const link = `${this.ctx.app.config.preInvitationLink}?qid=${key}&type=${type}`;
    return {
      key,
      link,
    };
  }
  async updateInviteLink(key, params, expires) {
    await this.app.redis.set(key, JSON.stringify(params), 'EX', expires);
  }
  async findInviteLink(id) {
    return await this.app.redis.get(id);
  }
  async dropInviteLink(id) {
    await this.app.redis.del(id);
  }
}
module.exports = InviteService;
