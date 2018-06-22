'use strict';

const { createSchema } = require('../../lib/util/base-schema');

module.exports = app => {
  const { mongoose } = app;
  const schema = createSchema(mongoose);

  schema.add({
    nickName: String,
    avatarUrl: String,
    gender: Number,
    language: String,
    country: String,
    province: String,
    city: String,

    enable: Boolean,

    openId: String,
    unionId: String,

    email: String,
    mobile: String,
    password: String,
  });

  return mongoose.model('User', schema);
};
