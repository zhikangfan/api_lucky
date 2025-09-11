const { Controller } = require('egg');

class HealthController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = {
      status: 'ok',
    };
  }
}

module.exports = HealthController;
