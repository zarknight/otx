'use strict';

const Service = require('egg').Service;
const fs = require('fs');
const WechatAPI = require('co-wechat-api');
const API = Symbol('WxService#api');

class WxService extends Service {

  get api() {
    if (!this[API]) {
      const { config } = this;
      const { appId, appSecret } = config.wxauth;
      this[API] = new WechatAPI(appId, appSecret);
    }
    return this[API];
  }

  async getWxaCodeUnlimit({ page, scene }) {
    const { ctx } = this;
    const fileName = ctx.helper.sha1(page + scene);
    const filePath = `/var/tmp/wxcode/${fileName}.png`;

    try {
      await Promise.promisify(fs.access)(filePath, fs.constants.R_OK);
      return fs.createReadStream(filePath);
    } catch (e) {
      const token = await this.api.ensureAccessToken();
      const response = await this.ctx.curl({
        url: `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${token.accessToken}`,
        method: 'POST',
        data: { page, scene },
      });
      const data = response.data;
      data.pipe(fs.createWriteStream(filePath));
      return data;
    }
  }

}

module.exports = WxService;
