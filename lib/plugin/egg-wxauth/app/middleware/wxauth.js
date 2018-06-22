'use strict';

const url = require('url');
const consts = require('../../lib/wx-consts');
const wxlogin = require('../../lib/wx-login');
const { sha1, decryptWxData } = require('../../lib/wx-crypto');
const { LoginError } = require('../../lib/wx-errors');

/**
 * 创建小程序会话中间件
 * @param {Object} [options] 可选项
 * @param {string} [options.appId] 小程序 appId
 * @param {string} [options.appSecret] 小程序 appSecret
 * @param {string} [options.loginPath] 小程序会话登录路径
 * @param {string} [options.maxAge] 会话有效期
 * @param {Object} [options.store] 会话使用的 Store
 * @return {Function} 中间件函数
 */
module.exports = (options = {}) => {

  const requireOption = key => {
    const value = options[key];
    if (value) return value;
    throw new Error(`初始化失败：${key} 没有配置`);
  };

  const getParamHeader = (ctx, key) => {
    return ctx.get(key);
  };

  const getRequiredHeader = (ctx, key) => {
    const header = getParamHeader(ctx, key);
    if (header) return header;
    throw new LoginError(`请求头里没有找到 ${key}`);
  };

  const getStore = ctx => {
    const redis = ctx.app.redis;

    return {
      async get(key) {
        const res = await redis.get(key);
        return res ? JSON.parse(res) : null;
      },
      async set(key, value, maxAge) {
        await redis.set(key, JSON.stringify(value), 'PX', maxAge || 86400000);
      },
      async destroy(key) {
        await redis.del(key);
      },
    };
  };

  const appId = requireOption('appId');
  const appSecret = requireOption('appSecret');
  const loginPath = requireOption('loginPath');
  const maxAge = options.maxAge;

  return async (ctx, next) => {

    // 忽略非微信小程序请求
    if (!getParamHeader(ctx, consts.WX_HEADER_FLAG)) {
      await next();
      return;
    }

    const store = getStore(ctx);
    const isLoginPath = url.parse(ctx.url).pathname === loginPath;
    const skey = getParamHeader(ctx, consts.WX_HEADER_SKEY);

    if (skey) {
      // [查找已有会话] -------------------------------------------------------
      try {
        const session = await store.get(skey);

        if (!session) throw new Error('会话过期');
        if (skey !== sha1(session.session_key + session.openid)) throw new Error('skey 不正确');

        ctx.$wxInfo = session;
      } catch (err) {
        const error = consts.ERR_INVALID_SESSION;
        const message = `小程序会话已失效，请重新登录：${err ? err.message : '未知错误'}`;
        ctx.body = { code: -1, error, message };
        return;
      }

      if (isLoginPath) {
        ctx.body = { code: 0, message: '小程序会话已登录', skey };
        return;
      }

    } else if (isLoginPath) {
      // [创建新会话] ----------------------------------------------------------
      try {
        const code = getRequiredHeader(ctx, consts.WX_HEADER_CODE);
        const encryptData = getParamHeader(ctx, consts.WX_HEADER_ENCRYPTED_DATA);
        const iv = getParamHeader(ctx, consts.WX_HEADER_IV);

        const { session_key, openid } = await wxlogin(ctx, appId, appSecret, code);
        const skey = sha1(session_key + openid);

        let session = null;
        let userInfo = null;

        if (code && !encryptData && !iv) {
          session = await store.get(skey);
          userInfo = session.userInfo;
        } else {
          userInfo = decryptWxData(appId, session_key, encryptData, iv);
          session = { skey, userInfo, session_key, openid };
          await store.set(skey, session, maxAge);
        }

        ctx.$wxInfo = session;
        ctx.body = { code: 0, data: { skey, userInfo } };
      } catch (err) {
        const { type, message } = err;
        ctx.body = { code: -1, type, message };
      }

      return;
    }

    await next();
  };

};
