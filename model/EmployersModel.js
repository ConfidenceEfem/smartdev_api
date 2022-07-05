const mongoose = require('mongoose');
const { isEmail } = require('validator');

const JobsScehma = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
    },
    contactemail: {
      type: String,
    },
    description: {
      type: String,
    },
    skillSet: {
      type: String,
    },
    cost: {
      type: Number,
    },
    experience: {
      type: String,
    },
    deadline: {
      type: String,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    apply: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'apply',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('jobs', JobsScehma);
