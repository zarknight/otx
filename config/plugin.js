'use strict';

const path = require('path');

exports.static = true;

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.oss = {
  enable: true,
  package: 'egg-oss',
};

exports.io = {
  enable: true,
  package: 'egg-socket.io',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.wxauth = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-wxauth'),
};
