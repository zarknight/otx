'use strict';

const Controller = require('egg').Controller;

const registerRule = {
  username: 'string',
  password: 'password',
};

const loginRule = {
  username: 'string',
  password: 'password',
};

class UacController extends Controller {

  async login() {
    const { ctx, service } = this;

    ctx.validate(loginRule);

    const params = ctx.request.body;
    const user = await service.uac.login(params);
    const id = user._id;

    ctx.session.uid = id;
    ctx.rotateCsrfSecret();
    ctx.body = { id };
  }

  async register() {
    const { ctx, service } = this;

    ctx.validate(registerRule);

    const params = ctx.request.body;
    const user = await service.uac.register(params);

    ctx.session.uid = user._id;
    ctx.body = {};
  }

  async logout() {
    const { ctx } = this;

    ctx.session = null;
    ctx.body = {};
  }

  async cart() {
    const { ctx, service } = this;
    const user = await service.uac.getLoginUser();

    ctx.body = user;
  }

}

module.exports = UacController;
