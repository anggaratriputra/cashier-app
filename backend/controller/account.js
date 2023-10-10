const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {Account} = require("../models");
const fs = require("fs");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.handleLogin = async (req, res) => {
    const { user_identity: userIdentity, password } = req.body;
  
    try {
      const account = await Account.findOne({
        where: {
          [Op.or]: {
            email: userIdentity,
            username: userIdentity,
            password
          },
        },
      });
  
      if (!account) {
        res.status(401).json({
          ok: false,
          message: "Incorrect username or password",
        });
        return;
      }
  
      const isValid = await bcrypt.compare(password, account.password);
      if (!isValid) {
        res.status(401).json({
          ok: false,
          message: "Incorrect username or password",
        });
        return;
      }
      const payload = { id: account.id, isAdmin: account.isAdmin, isActive: account.isActive };
      const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
  
      const response = {
        token,
        profile: { 
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          username: account.username,
          photoProfile: account.photoProfile,
          isAdmin: account.isAdmin,
          isActive: account.isActive,
        },
        }
  
      res.status(200).json({
        ok: true,
        data: response,
      });
    } catch (error) {
      res.status(401).json({
        ok: false,
        message: String(error),
      });
    }
  };
  
  
  exports.handleUploadPhotoProfile = async (req, res) => {
  const {filename} = req.file;
  const {id: accountId} = req.user;
  
  try {
  const profile = await Account.findOne({ where: { accountId, } }); 
  if (profile.photoProfile) {
    fs.rmSync(__dirname + "/../public/" + profile.photoProfile);
  }
  
  profile.photoProfile = filename;
  await profile.save();
  
  res.json({
    ok: true,
    date: "Profile picture updated",
  });
  } catch(error) {
    res.status(500).json({
      ok: false,
      message: String(error),
    })
  }
  };