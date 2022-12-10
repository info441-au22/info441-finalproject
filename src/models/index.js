const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url =
  'mongodb+srv://admin:password12345@cluster0.9hfnw7i.mongodb.net/spotify-recap';
db.playlists = require('./models')(mongoose);
console.log(db + 'db successfully connected?');
module.exports = db;
