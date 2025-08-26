const { Controller } = require('egg');

class HistoryController extends Controller {
  async getHistoryList() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async addHistory() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async updateHistory() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
}

module.exports = HistoryController;
