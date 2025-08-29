const Service = require('egg').Service;
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class HistoryService extends Service {
  async getHistoryList(uid) {
    return new Promise((resolve, reject) => {
      const filePath = this.ctx.app.config.historyDataPath;
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
        resolve([]);
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        const d = JSON.parse(data.toString());
        const history = d.filter(history => history.uid === uid);
        resolve(history);
      });
    });
  }

  async addHistory({ uid, prizeId, name }) {
    return new Promise((resolve, reject) => {
      const filePath = this.ctx.app.config.historyDataPath;
      const historyInfo = { uid, prizeId, name, status: false, writeOffOperatorUid: null, hid: uuidv4(), createAt: new Date().getTime(), updateAt: new Date().getTime() };
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([ historyInfo ]), 'utf8');
        return historyInfo;
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        const d = JSON.parse(data.toString());
        d.push(historyInfo);
        fs.writeFile(filePath, JSON.stringify(d), 'utf8', err => {
          if (err) {
            reject(err);
          }
          resolve(historyInfo);
        });
      });
    });
  }

  async updateHistory(hid, params) {
    return new Promise((resolve, reject) => {
      const filePath = this.ctx.app.config.historyDataPath;
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        const d = JSON.parse(data.toString());
        const index = d.findIndex(history => history.hid === hid);
        d[index] = Object.assign(d[index], params);
        fs.writeFile(filePath, JSON.stringify(d), 'utf8', err => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    });
  }

  async findHistory(hid) {
    return new Promise((resolve, reject) => {
      const filePath = this.ctx.app.config.historyDataPath;
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
        resolve({});
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        const d = JSON.parse(data.toString());
        const historyInfo = d.find(history => history.hid === hid);
        resolve(historyInfo);
      });
    });
  }
}

module.exports = HistoryService;
