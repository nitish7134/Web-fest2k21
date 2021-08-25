var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Question = new Schema({
    QuestionStatement: {
      type: String
    },
    options :{
        type: [String]
    }, 
    score:{
        type: Number
    },
});

module.exports = mongoose.model('Question', Question);