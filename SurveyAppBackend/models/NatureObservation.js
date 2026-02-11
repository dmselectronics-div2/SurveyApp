const mongoose = require('mongoose');

const natureObservationSchema = new mongoose.Schema({
  category: {
    type: String,
    default: 'Nature',
  },
  natureType: {
    type: String,
    required: [true, 'Nature type is required'],
    enum: ['Natural events', 'Aesthetics', 'Other'],
  },
  photo: {
    type: String,
    required: [true, 'Photo is required'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  timeOfDay: {
    type: String,
    required: [true, 'Time of day is required'],
    enum: ['Morning', 'Noon', 'Evening', 'Night'],
  },
  description: {
    type: String,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('NatureObservation', natureObservationSchema);
