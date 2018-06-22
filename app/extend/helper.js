'use strict';

const crypto = require('crypto');

const MOBILE_RE = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
const EMAIL_RE = /^[a-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+(?:\.[a-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?$/;

module.exports = {

  parseMsg(action, payload = {}, metadata = {}) {
    return {
      meta: Object.assign({}, { timestamp: Date.now() }, metadata),
      data: { action, payload },
    };
  },

  isMobile(val) {
    return MOBILE_RE.test(val);
  },

  isEmail(val) {
    return EMAIL_RE.test(val);
  },

  sha1(message) {
    return crypto.createHash('sha1').update(message, 'utf8').digest('hex');
  },

};
