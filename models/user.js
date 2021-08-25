var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  facebookId: String,
  googleId: String,
  quizzes:
    [{
      quiz: String,
      score: Number
    }]
  ,
  email: {
    type: String,
    unique: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  coins: {
    type: Number,
    default: '0'
  },
  assetValue: {
    type: Number,
    default: '0'
  },
  totalValue: {
    type: Number,
    default: '0'
  },
  spons: {
    type: [String],
    default: []
  },
  
  purchasedItems: [{
    itemName: String,
    quantity: Number,
    imageName: String
  }]

}, {
  timestamp: true
} 
);

module.exports = mongoose.model('User', User);