'use strict';

const { LoginError } = require('./wx-errors');

/**
 * 使用 code 换取 openid 和 session_key
 * @param {Object} ctx Egg Context
 * @param {String} appid 小程序 appid
 * @param {String} secret 小程序 app_secret
 * @param {String} js_code 小程序登录凭证 code
 * @return {Object} 换取到的 openid 和 session_key
 */
async function login(ctx, appid, secret, js_code) {
  try {
    const result = await ctx.curl('https://api.weixin.qq.com/sns/jscode2session', {
      dataType: 'json',
      data: { grant_type: 'authorization_code', appid, secret, js_code },
    });

    const data = result.data;

    if (data.errcode || !data.openid || !data.session_key) {
      throw data;
    }

    return data;
  } catch (e) {
    throw new LoginError('使用 jscode 从微信服务器换取 session_key 失败', '' + e);
  }
}

module.exports = login;
