var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Notif = new Schema({
    notifText: {
        type:String,
        default:"Starting Right Now"
    },
    notifTime: Date,
});

module.exports = mongoose.model('Notif', Notif);