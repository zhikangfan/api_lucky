const Service = require('egg').Service;

class UserService extends Service {
  async findUser(uid) {
    return await this.ctx.model.User.findOne({
      where: {
        id: uid,
      },
      attributes: {
        exclude: [ 'password' ],
      },
    });
  }

  async findUserByAccount(account) {
    return await this.ctx.model.User.findOne({
      where: {
        account,
      },
      // attributes: {
      //   exclude: [ 'password' ],
      // },
    });
  }

  async registerUser({ nickname, account, password, avatar = '' }) {
    return await this.ctx.model.User.create({ nickname, account, password, avatar });
  }

  async removeUser(uid) {
    return await this.ctx.model.User.update({
      status: false,
    }, {
      where: {
        id: uid,
      },
    });
  }

  async updateUser(uid, params) {
    return await this.ctx.model.User.update(params, {
      where: {
        id: uid,
      },
    });
  }
}

module.exports = UserService;
