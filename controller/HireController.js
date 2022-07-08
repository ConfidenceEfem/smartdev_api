const mongoose = require('mongoose');
const HireModel = require('../model/HireDeveloperModel');
const UserModel = require('../model/UserModel');
const router = require('../router/Router');

const getAllHired = async (req, res) => {
  try {
    const allHired = await HireModel.find();
    res.status(201).json({ message: 'All Hired Developer', data: allHired });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const getOneHired = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: 'Id not found' });
    } else {
      const oneHired = await HireModel.findById();
      res.status(201).json({ message: 'All Hired Developer', data: oneHired });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const HireDeveloper = async (req, res) => {
  try {
    const clientid = req.params.clientid;
    const developerid = req.params.developerid;

    const {
      clientName,
      email,
      details,
      salary,
      jobTitle,
      workingHours,
      acceptOffer,
    } = req.body;

    const findClient = await UserModel.findById(clientid);
    const findDeveloper = await UserModel.findById(developerid);
    if (!findClient) {
      res.status(404).json({ message: 'Client not found' });
    } else {
      const DeveloperHired = new HireModel({
        clientName,
        email,
        details,
        salary,
        jobTitle,
        workingHours,
        acceptOffer,
      });

      DeveloperHired.user = findClient;
      DeveloperHired.developer = findDeveloper;
      DeveloperHired.save();

      findClient.hiredDevelopers.push(
        mongoose.Types.ObjectId(DeveloperHired._id)
      );
      findDeveloper.hire.push(mongoose.Types.ObjectId(DeveloperHired._id));
      findClient.save();
      findDeveloper.save();

      res.status(201).json({
        message: 'Developer Hired Successfully',
        data: DeveloperHired,
      });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const AcceptOffer = async (req, res) => {
  try {
    const hireId = req.params.hireid;
    const clientid = req.params.clientid;
    const devid = req.params.devid;

    const findHire = await HireModel.findById(hireId);
    const findClient = await UserModel.findById(clientid);
    const findDev = await UserModel.findById(devid);

    const updateOffer = await HireModel.findByIdAndUpdate(
      hireId,
      { acceptOffer: true },
      { new: true }
    );

    res
      .status(201)
      .json({ message: 'Updated Successfully', data: updateOffer });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// const deleteHire = async (req,res)=> {
//   try {
//     const getOneUser = await HireMo
//   } catch (error) {
//     res.status(404).json({message: error.message})
//   }
// }

module.exports = {
  getAllHired,
  getOneHired,
  HireDeveloper,
  AcceptOffer,
};
