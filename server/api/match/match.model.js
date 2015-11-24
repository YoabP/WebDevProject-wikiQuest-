'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MatchSchema = new Schema({
  creator: String,
  guests: [String],
  started: Boolean,
  winner: {
    name: String,
    backs: Number,
    start: String,
    end: String,
    pages: [String]
  },
  ended: Boolean,
  messages: [{alias:String, msg: String}]
});

module.exports = mongoose.model('Match', MatchSchema);
