const Service = require('egg').Service;
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class UserService extends Service {
  async findUser(uid) {
    return new Promise((resolve, reject) => {
      const filePath = this.ctx.app.config.userDataPath;
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
        resolve({});
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        const d = JSON.parse(data.toString());
        const userInfo = d.find(user => user.uid === uid);
        resolve(userInfo);
      });
    });
  }

  async findUserByAccount(account) {
    return new Promise((resolve, reject) => {
      const filePath = this.ctx.app.config.userDataPath;
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
        resolve({});
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        const d = JSON.parse(data.toString());
        const userInfo = d.find(user => user.account === account);
        resolve(userInfo);
      });
    });
  }

  async registerUser({ nickname, account, password }) {
    return new Promise((resolve, reject) => {
      const filePath = this.ctx.app.config.userDataPath;
      const userInfo = { nickname, account, password, uid: uuidv4(), count: 0 };
      if (!fs.existsSync(filePath)) {
        fs.writeFile(filePath, JSON.stringify([ userInfo ]), 'utf8', err => {
          if (err) {
            reject(err);
          }
          resolve(userInfo);
        });
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        const d = JSON.parse(data.toString());
        d.push(userInfo);
        fs.writeFile(filePath, JSON.stringify(d), 'utf8', err => {
          if (err) {
            reject(err);
          }
          resolve(userInfo);
        });
      });
    });
  }

  async removeUser(uid) {
    return new Promise((resolve, reject) => {
      const filePath = this.ctx.app.config.userDataPath;
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        const d = JSON.parse(data.toString());
        const index = d.findIndex(user => user.uid === uid);
        d.splice(index, 1);
        fs.writeFile(filePath, JSON.stringify(d), 'utf8', err => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    });
  }

  async updateUser(uid, params) {
    return new Promise((resolve, reject) => {
      const filePath = this.ctx.app.config.userDataPath;
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        const d = JSON.parse(data.toString());
        const index = d.findIndex(user => user.uid === uid);
        d[index] = Object.assign(d[index], params, { uid: d[index].uid });
        fs.writeFile(filePath, JSON.stringify(d), 'utf8', err => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    });
  }
}

module.exports = UserService;
