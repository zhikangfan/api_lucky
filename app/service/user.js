const Service = require('egg').Service;

class UserService extends Service {
  async findUser(uid) {
    return await this.ctx.model.User.findOne({
      where: {
        id: uid,
      },
      include: [
        {
          model: this.ctx.model.User,
          as: 'companion_user',
          attributes: [ 'id', 'nickname', 'account' ],
        },
      ],
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
  async bindUser(uid, bindId) {
    const t = await this.ctx.model.transaction();
    try {
      await this.ctx.model.User.update({
        companion: bindId,
      }, {
        where: {
          id: uid,
        },
        transaction: t,
      });
      await this.ctx.model.User.update({
        companion: uid,
      }, {
        where: {
          id: bindId,
        },
        transaction: t,
      });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async unbindUser(uid, unbindId) {
    const t = await this.ctx.model.transaction();
    try {
      await this.ctx.model.User.update({
        companion: null,
      }, {
        where: {
          id: uid,
        },
        transaction: t,
      });
      await this.ctx.model.User.update({
        companion: null,
      }, {
        where: {
          id: unbindId,
        },
        transaction: t,
      });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }
}

module.exports = UserService;
