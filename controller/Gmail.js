const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const crypto = require('crypto');
const { response } = require('express');

const oAuthPass = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

oAuthPass.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const verificationEmail = async (email, otp, id) => {
  try {
    const createToken = await oAuthPass.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'smartdevopss@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refresh_token: process.env.REFRESH_TOKEN,
        accessToken: createToken.token,
      },
    });

    const mailOptions = {
      from: `SmartDev <"smartdevopss@gmail.com">`,
      to: email,
      subject: `Verify your Email with SmartDev`,
      html: `<h3>Thanks for Creating an account with SmartDev. Click on this <a href="http://localhost:3000/con/${otp}/${id}">Link</a> to verify your mail, ${otp} </h3>`,
    };

    const result = transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(info.response);
      }
    });

    return result;
  } catch (error) {
    return error;
  }
};

const ClientVerification = async (email, otp, id) => {
  try {
    const createToken = await oAuthPass.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'smartdevopss@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refresh_token: process.env.REFRESH_TOKEN,
        accessToken: createToken.token,
      },
    });

    const mailOption = {
      from: `SMART <"smartdevopss@gmail.com">`,
      to: email,
      subject: 'CLIENT VERFICATION',
      html: `Thank you for Creating an account with SMART. Click this <a href="http://localhost:3000/client/${otp}/${id}">Link</a> to complete your process`,
    };
    const result = transport.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(info.response);
      }
    });

    return result;
  } catch (error) {
    return error;
  }
};

module.exports = { verificationEmail, ClientVerification };
