const UserModel = require('../model/UserModel');
const EmployersModel = require('../model/EmployersModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

require('dotenv').config();

const postJob = async (req, res) => {
  try {
    const clientID = req.params.id;
    const findUser = await UserModel.findById(clientID);
    if (!findUser.isClient) {
      res.status(400).json({ message: "You don't have right for this" });
    }
    const {
      jobTitle,
      contactemail,
      description,
      skillSet,
      cost,
      experience,
      deadline,
    } = req.body;

    const ClientJobPost = new EmployersModel({
      jobTitle,
      contactemail,
      description,
      skillSet,
      cost,
      experience,
      deadline,
    });

    ClientJobPost.user = findUser;
    ClientJobPost.save();

    findUser.jobs.push(mongoose.Types.ObjectId(ClientJobPost._id));
    findUser.save();

    res
      .status(201)
      .json({ message: 'Job Posted Successfully', data: ClientJobPost });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllJob = async (req, res) => {
  try {
    const AllClients = await EmployersModel.find();
    res.status(201).json({ message: 'All Jobs', data: AllClients });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOneClientJob = async (req, res) => {
  try {
    const clientid = req.params.clientid;
    const findClientJobs = await UserModel.findById(clientid).populate('jobs');
    res.status(201).json({ message: 'All Clients Jobs', data: findClientJobs });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOneJob = async (req, res) => {
  try {
    const jobid = req.params.jobid;
    if (!jobid) {
      res.status(400).json({ message: 'Unsucessful id' });
    } else {
      const getOneJob = await EmployersModel.findById(req.params.jobid);
      if (!getOneJob) {
        res.status(400).json({ message: 'Unsucessful' });
      } else {
        res.status(201).json({ message: 'One Job Details', data: getOneJob });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const clientid = req.params.clientid;
    const jobid = req.params.jobid;
    const findUser = await UserModel.findById(clientid);
    if (!findUser.isClient) {
      res
        .status(400)
        .json({ message: "You don't have right for this operaion" });
    }

    const deleteItem = await EmployersModel.findByIdAndDelete(jobid);

    findUser.jobs.pull(deleteItem);
    findUser.save();

    res.status(201).json({ message: 'This data deleted', data: deleteItem });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const userid = req.params.clientid;
    const jobid = req.params.jobid;

    const {
      jobTitle,
      contactemail,
      description,
      skillSet,
      cost,
      experience,
      deadline,
    } = req.body;

    const findUser = await UserModel.findById(userid);
    const findJob = await EmployersModel.findById(jobid);
    if (!findUser.isClient) {
      res
        .status(201)
        .json({ message: "You don't have right for this operation" });
    }
    if (!findJob.user === findUser._id) {
      res
        .status(201)
        .json({ message: "You don't have right for this operation as a User" });
    } else {
      const updateItem = await EmployersModel.findByIdAndUpdate(
        jobid,
        {
          jobTitle,
          contactemail,
          description,
          skillSet,
          cost,
          experience,
          deadline,
        },
        { new: true }
      );

      res.status(201).json({ message: 'Yes you can', data: updateItem });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  postJob,
  getAllJob,
  getOneClientJob,
  getOneJob,
  deleteJob,
  updateJob,
};
