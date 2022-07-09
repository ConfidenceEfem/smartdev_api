const UserModel = require('../model/UserModel');
const EmployersModel = require('../model/EmployersModel');
const jwt = require('jsonwebtoken');
const ApplyModel = require('../model/ApplyModel');
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');

const getAllApply = async (req, res) => {
  try {
    const allApplied = await ApplyModel.find();
    res.status(201).json({ message: 'All Applied Jobs', data: allApplied });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const getOneApply = async (req, res) => {
  try {
    const OneApplied = await ApplyModel.findById(req.params.id);
    res.status(201).json({ message: 'One Applied Jobs', data: OneApplied });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const ApplyForAJob = async (req, res) => {
  try {
    const { name, email, applicationLetter } = req.body;
    const developerId = req.params.id;
    if (!developerId) {
      res.status(400).json({ message: 'Input an Id' });
    } else {
    }

    // const findClient = await UserModel.findById(req.params.clientid);

    const findUser = await UserModel.findById(developerId);
    if (!findUser.isDeveloper) {
      res
        .status(400)
        .json({ message: "You don't have right as a User for this" });
    } else {
      const findJobs = await EmployersModel.findById(req.params.jobid);
      if (!findJobs) {
        res.status(400).json({ message: "You don't have right for this" });
      }
      const image = await cloudinary.uploader.upload(req.file.path);
      const applyItem = new ApplyModel({
        email,
        name,
        cvImage: image.secure_url,
        cvImageid: image.public_id,
        applicationLetter,
      });

      applyItem.user = findUser;
      applyItem.job = findJobs;
      applyItem.save();
      // applyItem.client = findClient;
      // applyItem.save();

      findJobs.apply.push(mongoose.Types.ObjectId(applyItem._id));
      findJobs.save();

      findUser.applied.push(mongoose.Types.ObjectId(applyItem._id));
      findUser.save();

      res
        .status(201)
        .json({ message: 'You successfully Applied for Job', data: applyItem });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getAllApply, getOneApply, ApplyForAJob };
