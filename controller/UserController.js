const UserModel = require('../model/UserModel');
const OtpModel = require('../model/OtpModel');
const EmployersModel = require('../model/EmployersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cloudinary = require('../config/cloudinary');
const { verificationEmail, ClientVerification } = require('./Gmail');
require('dotenv').config();

const RegisterAUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const otp = crypto.randomBytes(10).toString('hex');
    console.log(otp);

    const createOtp = new OtpModel({
      email: email,
      otp: otp,
    });

    const saltPassword = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, saltPassword);

    const user = await UserModel.create({
      email,
      password: hash,
      name,
    });

    const result1 = await user.save();

    verificationEmail(email, otp, user._id);

    const salt = await bcrypt.genSalt(10);
    createOtp.otp = await bcrypt.hash(createOtp.otp, salt);

    createOtp.save();

    res.status(201).json({
      message: 'Check your email for verification',
      data: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const RegisterAClient = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const findUser = await UserModel.findOne({ email: email });

    if (findUser) {
      res.status(400).json({ message: 'User already exist' });
    } else {
      const otp = crypto.randomBytes(10).toString('hex');

      console.log(otp);

      const createOtp = new OtpModel({
        email: email,
        otp: otp,
      });

      const saltPassword = await bcrypt.genSalt(10);

      const hash = await bcrypt.hash(password, saltPassword);

      const user = await UserModel.create({
        email,
        password: hash,
        name,
      });

      const result1 = await user.save();

      ClientVerification(email, otp, user._id);

      const salt = await bcrypt.genSalt(10);

      createOtp.otp = await bcrypt.hash(createOtp.otp, salt);

      const result = await createOtp.save();

      res.status(201).json({
        message: 'Check your email for verification',
        data: user,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const verifyAClient = async (req, res) => {
  try {
    const id = req.params.id;
    const findUser = await UserModel.findById(id);
    const otpHolder = await OtpModel.find({ email: findUser.email });
    const rightOtp = otpHolder[otpHolder.length - 1];
    const validate = await bcrypt.compare(req.params.otp, rightOtp.otp);
    if (!validate) {
      res.status(200).json({ message: 'Incorrect Otp' });
    }
    const updateUser = await UserModel.findByIdAndUpdate(
      id,
      { isClient: true },
      { new: true }
    );
    res
      .status(201)
      .json({ message: 'Client Registration Completed', data: updateUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const VerifyADeveloper = async (req, res) => {
  try {
    const id = req.params.id;
    const findUser = await UserModel.findById(id);
    if (!findUser) {
      res.status(400).json({ message: 'User not found' });
    }

    const otpHolder = await OtpModel.find({ email: findUser.email });
    console.log(otpHolder.length);
    if (otpHolder.length === 0) {
      res.status(400).json({ message: 'You used an expired OTP' });
    } else {
      const rightOtp = otpHolder[otpHolder.length - 1];
      const validUser = await bcrypt.compare(req.params.otp, rightOtp.otp);
      if (validUser) {
        const user = await UserModel.findByIdAndUpdate(
          id,
          { isDeveloper: true },
          { new: true }
        );

        await OtpModel.deleteMany({ email: rightOtp.email });

        return res.status(201).json({
          message: 'User Registeration Completed',
          data: user,
        });
      } else {
        res.status(404).json({ message: 'Incorrect OTP' });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const GetAllUsers = async (req, res) => {
  try {
    const getAll = await UserModel.find();
    res.status(201).json({ message: 'All Users', data: getAll });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getOneUser = async (req, res) => {
  try {
    const getAll = await UserModel.findById(req.params.id)
      .populate('jobs')
      .populate('hire')
      .populate('hiredDevelopers');
    res.status(201).json({ message: 'One User', data: getAll });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const SignInNewUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await UserModel.findOne({ email: email });
    if (findUser.isDeveloper || findUser.isClient) {
      if (findUser) {
        const checkPassword = await bcrypt.compare(password, findUser.password);
        if (checkPassword) {
          const { password, ...doc } = findUser._doc;
          const token = jwt.sign({ ...doc }, process.env.JWT_SECRET, {
            expiresIn: '2d',
          });

          res.status(201).json({
            message: 'You have log in successfully',
            data: { data: { ...doc }, token: token },
          });
        } else {
          res.status(404).json({ message: 'Incorrect Password' });
        }
      } else {
        res.status(400).json({ message: "This User dosn't exist" });
      }
    } else {
      res.status(201).json({ message: 'You are not yet Verified' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await UserModel.findOne({ email });
    if (findUser) {
      const otp = crypto.randomBytes(10).toString('hex');
      console.log(otp);

      const createOtp = new OtpModel({
        otp: otp,
        email: email,
      });

      const salt = await bcrypt.genSalt(10);
      createOtp.otp = await bcrypt.hash(createOtp.otp, salt);

      createOtp.save();

      res.status(201).json({ message: 'OTP sent successfully', otp });
    } else {
      res.status(400).json({ message: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const newPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const otpHolder = await OtpModel.find({ email });
    if (otpHolder.length === 0) {
      res.status(400).json({ message: 'You used an expired OTP' });
    } else {
      const rightOtp = otpHolder[otpHolder.length - 1];
      const validOtp = await bcrypt.compare(req.params.otp, rightOtp.otp);
      if (validOtp) {
        const findUser = await UserModel.findOne({ email });
        if (findUser) {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);
          const updatePassword = await UserModel.findByIdAndUpdate(
            findUser._id,
            { password: hash },
            { new: true }
          );
          res
            .status(201)
            .json({ message: 'You have update your password successfully' });
        } else {
          res.status(400).json({ message: "This user doesn't exist" });
        }
      } else {
        res.status(400).json({ message: 'You used an incorrect OTP' });
      }
    }
  } catch (error) {}
};

const ResetPassword = async (req, res) => {
  try {
    const { email, password, newPassword } = req.body;

    const findUser = await UserModel.findOne({ email });
    if (findUser) {
      const checkPassword = await bcrypt.compare(password, findUser.password);
      if (checkPassword) {
        const updatePassword = await UserModel.findByIdAndUpdate(
          findUser._id,
          { password: newPassword },
          { new: true }
        );
      } else {
        res
          .status(404)
          .json({ message: 'Please check your password or email' });
      }
    } else {
      res.status(404).json({ message: "This user doesn't exist" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateADeveloper = async (req, res) => {
  const { name, stack, status, experience, bio } = req.body;

  try {
    const image = await cloudinary.uploader.upload(req.file.path);
    const updateUser = await UserModel.findByIdAndUpdate(req.params.id, {
      name,
      stack,
      status,
      image: image.secure_url,
      imageID: image.public_id,
      experience,
      bio,
    });
    res
      .status(201)
      .json({ message: 'User Updated Sucessfully', data: updateUser });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  RegisterAUser,
  VerifyADeveloper,
  SignInNewUser,
  RegisterAClient,
  // verifyEmailLogin,
  newPassword,
  ResetPassword,
  ForgetPassword,
  GetAllUsers,
  getOneUser,
  verifyAClient,
  updateADeveloper,
};
