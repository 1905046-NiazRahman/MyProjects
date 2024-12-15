const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserDpLocationSchema = new Schema({
  userLat: {
    type: Number,
    required: false
  },
  userLng: {
    type: Number,
    required: false
  },
  dpLat: {
    type: Number,
    required: false
  },
  dpLng: {
    type: Number,
    required: false
  }
});

const UserDpLocation = mongoose.model('UserDpLocation', UserDpLocationSchema);

module.exports = UserDpLocation;