'use strict';

const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Service = require('egg').Service;

class UacService extends Service {

  async register(options) {
    const { ctx, service } = this;
    const { User } = ctx.model;
    const username = _.trim(options.username);
    const password = _.trim(options.password);

    let user;

    if (ctx.helper.isMobile(username)) {
      const mobileExist = await service.user.mobileExist(username);
      ctx.assert(!mobileExist, { code: 'mobile_register_occupied' });

      user = await User.create({
        mobile: username,
        password: await bcrypt.hash(password, 10),
      });
    } else if (ctx.helper.isEmail(username)) {
      const emailExist = await service.user.emailExist(username);
      ctx.assert(!emailExist, { code: 'email_register_occupied' });

      user = await User.create({
        email: username,
        pass: await bcrypt.hash(password, 10),
      });
    }

    ctx.assert(user, { code: 'account_create_fail' });

    return user;
  }

  async login(options) {
    const { ctx, service } = this;
    const username = _.trim(options.username);
    const password = _.trim(options.password);

    let user;

    if (ctx.helper.isMobile(username)) {
      user = await service.user.findByMobile(username);
    } else if (ctx.helper.isEmail(username)) {
      user = await service.user.findByEmail(username);
    }

    ctx.assert(user, { code: 'user_not_exist' });

    const isPassMatched = await bcrypt.compare(password, user.password);

    ctx.assert(isPassMatched, { code: 'pass_not_correct' });

    return user;
  }

  async getLoginUser() {
    const { ctx } = this;
    const { $wxInfo, session, model } = ctx;
    const { User } = model;

    try {
      if ($wxInfo) {
        const { userInfo } = $wxInfo;
        const params = {};

        if (userInfo.unionId) {
          params.unionId = userInfo.unionId;
        }

        if (userInfo.openId) {
          params.openId = userInfo.openId;
        }

        return await User.findOne(Object.assign({ enable: true }, params))
          || await User.create(Object.assign({ enable: true }, userInfo));
      } else if (session && session.uid) {
        return await User.findById(session.uid);
      }
    } catch (err) {
      ctx.throw({ code: 'account_retrieve_fail' });
    }

    return null;
  }

}

module.exports = UacService;
