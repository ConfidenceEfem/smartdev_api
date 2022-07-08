const express = require('express');
const router = express.Router();
const { upload } = require('../config/multer');
const { uploadCv } = require('../config/cvMulter');
const { uploadUser } = require('../config/userMulter');
const {
  RegisterAUser,
  VerifyADeveloper,
  SignInNewUser,
  // verifyEmailLogin,
  ResetPassword,
  newPassword,
  ForgetPassword,
  GetAllUsers,
  getOneUser,
  updateADeveloper,
  RegisterAClient,
  verifyAClient,
} = require('../controller/UserController');
const {
  postJob,
  getAllJob,
  getOneClientJob,
  getOneJob,
  deleteJob,
  updateJob,
} = require('../controller/JobController');
const {
  getAllApply,
  getOneApply,
  ApplyForAJob,
} = require('../controller/ApplyController');

const {
  getAllHired,
  getOneHired,
  HireDeveloper,
  AcceptOffer,
} = require('../controller/HireController');

router.post('/register', RegisterAUser);
router.post('/verify/:otp/:id', VerifyADeveloper);
router.post('/loginverify', SignInNewUser);
router.post('/reset/password', ForgetPassword);
router.post('/rest/verfiypassword/:otp', newPassword);
router.post('/updatepassword', ResetPassword);
router.get('/allusers', GetAllUsers);
router.get('/user/:id', getOneUser);
router.post('/register/client', RegisterAClient);
router.post('/register/client/:otp/:id', verifyAClient);
router.put('/user/:id', uploadUser, updateADeveloper);

router.post('/jobpost/:id', upload, postJob);
router.get('/alljobs', getAllJob);
router.get('/clientjob/:clientid', getOneClientJob);
router.get('/clientonejob/:jobid', getOneJob);
router.delete('/clientjob/:clientid/:jobid', deleteJob);
router.put('/clientjob/:clientid/:jobid', upload, updateJob);

router.get('/allapplied', getAllApply);
router.get('/oneapply/:id', getOneApply);
router.post('/oneapply/:id/:jobid', uploadCv, ApplyForAJob);

router.post('/hire/:clientid/:developerid', HireDeveloper);
router.get(`/getAllhired`, getAllHired);
router.patch(`/hireupdate/:hireid/:clientid/:devid`, AcceptOffer);

module.exports = router;
