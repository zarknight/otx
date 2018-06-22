'use strict';

const crypto = require('crypto');

function sha1(message) {
  return crypto.createHash('sha1').update(message, 'utf8').digest('hex');
}

/**
 * 微信加密数据解密
 * @param {String} appId 小程序 appid
 * @param {String} sessionKey 小程序 session_key
 * @param {String} encryptedData 小程序加密用户数据
 * @param {String} iv 小程序密钥
 * @return {String} 解密后的用户数据
 */
function decryptWxData(appId, sessionKey, encryptedData, iv) {
  const sesskey = new Buffer(sessionKey, 'base64');
  const encoded = new Buffer(encryptedData, 'base64');
  const biv = new Buffer(iv, 'base64');

  let decoded = null;

  try {
    const decipher = crypto.createDecipheriv('aes-128-cbc', sesskey, biv);
    decipher.setAutoPadding(true);
    decoded = decipher.update(encoded, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    decoded = JSON.parse(decoded);
  } catch (err) {
    throw new Error('Illegal Buffer');
  }

  if (decoded.watermark.appid !== appId) {
    throw new Error('Illegal Buffer');
  }

  return decoded;
}

module.exports = { sha1, decryptWxData };
