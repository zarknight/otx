'use strict';

global.Promise = require('bluebird');
require('uws');

module.exports = appInfo => {
  const config = exports = {};
  const appName = appInfo.name;

  config.keys = `${appName}_1529417837216_1875`;

  config.middleware = [
    'mdSessionAuth',
  ];

  config.mdSessionAuth = {
    match: `/${appName}/u/`,
  };

  config.session = {
    key: 'msid',
  };

  config.cors = {
    credentials: true,
  };

  config.mongoose = {
    url: `mongodb://127.0.0.1:27017/${appName}`,
    options: {},
  };

  config.redis = {
    agent: true,
    client: {
      host: '127.0.0.1',
      port: '6379',
      password: '',
      db: '0',
    },
  };

  config.io = {
    init: {
      wsEngine: 'uws',
    },
    namespace: {
      '/p2p': {
        connectionMiddleware: [ 'auth' ],
        packetMiddleware: [],
      },
      '/chatroom': {
        connectionMiddleware: [ 'chat' ],
        packetMiddleware: [],
      },
    },
    redis: {
      host: '127.0.0.1',
      port: '6379',
      auth_pass: '',
      db: 0,
    },
  };

  config.wxauth = {
    appId: '',
    appSecret: '',
    loginPath: `/${appName}/wxlogin`,
  };

  config.oss = {
    client: {
      accessKeyId: '',
      accessKeySecret: '',
      bucket: `${appName}-assets`,
      endpoint: 'oss-cn-hangzhou.aliyuncs.com',
      timeout: '60s',
    },
  };

  return config;
};
