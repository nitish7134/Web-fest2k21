var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MarketPlace = new Schema({
    itemName: {
        type: String,
        unique: true
    },
    cost: Number,
    availableQuantity: Number,
    description: String,
    redirectUrl: String,
    imageName: String
});

module.exports = mongoose.model('MarketPlace', MarketPlace);