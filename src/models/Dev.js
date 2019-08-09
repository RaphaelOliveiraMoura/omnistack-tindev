const { Schema, model } = require('mongoose');

const DevSchema = new Schema(
  {},
  {
    timestamps: true
  }
);

module.exports = model('Dev', DevSchema);
