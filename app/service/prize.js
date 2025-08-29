const Service = require('egg').Service;
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class PrizeService extends Service {
  async getAll() {
    return new Promise((resolve, reject) => {
      const filePath = this.ctx.app.config.prizeDataPath;
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
        resolve([]);
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        const d = JSON.parse(data.toString());
        resolve(d);
      });
    });
  }

  async addPrize({ chance, name, desc, expires = 0 }) {
    return new Promise((resolve, reject) => {
      const filePath = this.ctx.app.config.prizeDataPath;
      const prizeInfo = { chance, name, desc, pid: uuidv4(), expires, createAt: new Date().getTime(), updateAt: new Date().getTime() };
      if (!fs.existsSync(filePath)) {
        fs.writeFile(filePath, JSON.stringify([ { ...prizeInfo } ]), 'utf8', err => {
          if (err) {
            reject(err);
          }
          resolve(prizeInfo);
        });
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        try {
          const d = JSON.parse(data.toString());
          d.push(prizeInfo);
          fs.writeFile(filePath, JSON.stringify(d), 'utf8', err => {
            if (err) {
              reject(err);
            }
            resolve(prizeInfo);
          });
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  async removePrize(pid) {
    return new Promise((resolve, reject) => {
      const filePath = this.ctx.app.config.prizeDataPath;
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        const d = JSON.parse(data.toString());
        const index = d.findIndex(prize => prize.pid === pid);
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

  async updatePrize(pid, params) {
    return new Promise((resolve, reject) => {
      const filePath = this.ctx.app.config.prizeDataPath;
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        const d = JSON.parse(data.toString());
        const index = d.findIndex(prize => prize.pid === pid);
        d[index] = Object.assign(d[index], params, { pid: d[index].pid });
        fs.writeFile(filePath, JSON.stringify(d), 'utf8', err => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    });
  }

  async findPrizeByName(name) {
    return new Promise((resolve, reject) => {
      const filePath = this.ctx.app.config.prizeDataPath;
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
        resolve({});
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        const d = JSON.parse(data.toString());
        const prizeInfo = d.find(prize => prize.name === name);
        resolve(prizeInfo);
      });
    });
  }

  async findPrizeByPid(pid) {
    return new Promise((resolve, reject) => {
      const filePath = this.ctx.app.config.prizeDataPath;
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
        resolve({});
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        const d = JSON.parse(data.toString());
        const prizeInfo = d.find(prize => prize.pid === pid);
        resolve(prizeInfo);
      });
    });
  }
}

module.exports = PrizeService;
