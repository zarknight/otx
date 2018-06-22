'use strict';

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.get('X-WX-Flag')) {
      // 请求需要登录的微信小程序API
      if (!ctx.$wxInfo || !ctx.$wxInfo.userInfo) {
        ctx.throw({ code: 'invalid_wx_api_call' });
        return;
      }
    } else {
      // 请求需要登录的Web API
      if (!ctx.session || !ctx.session.uid) {
        ctx.throw({ code: 'invalid_web_api_call' });
        return;
      }
    }
    await next();
  };
};
