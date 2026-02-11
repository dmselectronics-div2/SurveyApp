const mongoose = require('mongoose');

const birdObservationSchema = new mongoose.Schema({
  species: String,
  count: String,
  maturity: String,
  sex: String,
  behaviour: String,
  identification: String,
  status: String,
  remarks: String,
  imageUri: String
});

const waterAvailabilitySchema = new mongoose.Schema({
  waterLevelWaterResources: String,
  waterAvailabilityWaterResources: String,
  waterLevel: String,
  selectedWaterConditions: [String],
  waterAvailabilityOnLand: String,
  waterAvailabilityOnResources: String,
  waterLevelOnLand: String,
  waterLevelOnResources: String
});

const birdSurveySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true
  },
  habitatType: String,
  behaviour: [String],
  point: String,
  pointTag: String,
  latitude: String,
  longitude: String,
  date: String,
  observers: String,
  startTime: String,
  endTime: String,
  weather: String,
  water: String,
  season: String,
  statusOfVegy: String,
  descriptor: String,
  radiusOfArea: String,
  remark: String,
  imageUri: String,
  cloudIntensity: String,
  rainIntensity: String,
  windIntensity: String,
  sunshineIntensity: String,
  waterAvailability: waterAvailabilitySchema,
  birdObservations: [birdObservationSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

birdSurveySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BirdSurvey', birdSurveySchema);
