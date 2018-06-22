'use strict';

const consts = require('./wx-consts');

/**
 * 登录错误信息类
 */
class LoginError extends Error {
  constructor(message, detail) {
    super(`登录小程序会话失败: ${message} (请检查服务器及小程序的 AppId 和 AppSecret 是否正确配置)`);
    this.type = consts.ERR_LOGIN_FAILED;
    this.detail = detail;
  }
}

module.exports = { LoginError };
