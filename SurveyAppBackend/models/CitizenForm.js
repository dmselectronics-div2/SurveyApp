const mongoose = require('mongoose');

const citizenFormSchema = new mongoose.Schema({
  latitude: String,
  longitude: String,
  imageUri: String,
  name: String,
  mobile: String,
  email: String,
  now: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CitizenForm', citizenFormSchema);
