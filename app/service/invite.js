const Service = require('egg').Service;
const { v4: uuidv4 } = require('uuid');
class InviteService extends Service {
  async addInviteLink({ inviter,
    type,
    expires,
  }) {
    const key = uuidv4();
    await this.app.redis.set(key, JSON.stringify({ inviter, type, status: false }), 'EX', expires);
    return key;
  }
  async findInviteLink(id) {
    return await this.app.redis.get(id);
  }
  async dropInviteLink(id) {
    await this.app.redis.del(id);
  }
}
module.exports = InviteService;
