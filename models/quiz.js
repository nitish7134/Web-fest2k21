
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Question = require('./question').schema;

var Quiz = new Schema({
  QuizName: {
    type: String,
    unique: true
  },
  startTime: Date,
  endTime: Date,
  Questions: {
    type: [Question],
  }
});

module.exports = mongoose.model('Quiz', Quiz);