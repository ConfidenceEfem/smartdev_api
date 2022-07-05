const mongoose = require('mongoose');

const HireSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    workingHours: {
      type: String,
      required: true,
    },
    acceptOffer: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('hire', HireSchema);
