const mongoose = require('mongoose');
const { isEmail } = require('validator');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please input your name'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please input your email'],
      validate: [isEmail, true],
    },
    stack: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Please input your password'],
    },
    status: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imageID: {
      type: String,
    },
    experience: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    isDeveloper: {
      type: Boolean,
      default: false,
      required: true,
    },
    isClient: {
      type: Boolean,
      default: false,
      required: true,
    },
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobs',
      },
    ],
    applied: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'apply',
      },
    ],
    hiredDevelopers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hire',
      },
    ],
    hire: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hire',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('user', UserSchema);
