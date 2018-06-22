'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  async findByEmail(email) {
    return await this.ctx.model.User.findOne({ email });
  }

  async findByMobile(mobile) {
    return await this.ctx.model.User.findOne({ mobile });
  }

  async emailExist(email) {
    const count = await this.ctx.model.User.count({ email });
    return count > 0;
  }

  async mobileExist(mobile) {
    const count = await this.ctx.model.User.count({ mobile });
    return count > 0;
  }

}

module.exports = UserService;
