const mongoose = require('mongoose');

const ApplySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    cvImage: {
      type: String,
      required: true,
    },
    cvImageid: {
      type: String,
    },
    applicationLetter: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'jobs',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('apply', ApplySchema);
