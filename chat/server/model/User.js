var mongoose = require('../config/db.js'),
  Schema = mongoose.Schema;

var User = new Schema ({
  imageUrl: {type: String},
  email: {type: String},
  userName: {type: String},
  password: {type: String}
})

module.exports = mongoose.model('User', User);