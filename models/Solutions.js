var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Solution = new Schema({
  Question: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  CorrectOption: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Solution', Solution);