'use strict';

const shortid = require('shortid');

function createSchema(mongoose) {
  const { Schema } = mongoose;

  const schema = new Schema({
    _id: {
      type: String,
      default: shortid.generate,
    },
    cd: {
      type: Date,
      default: Date.now,
    },
    ud: {
      type: Date,
      default: Date.now,
    },
  }, { usePushEach: true });

  return schema;
}

module.exports = { createSchema };
