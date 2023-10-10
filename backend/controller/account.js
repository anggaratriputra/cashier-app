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
  
  exports.updateAccount = async (req, res) => {
    const { username } = req.params;
    const { userName, firstName, lastName, password, photoProfile } = req.body;
  
    console.log(req.file);
  
    try {
      const account = await Account.findOne({ where: { username } });
  console.log(account)
      if (!account) {
        res.status(404).json({
          ok: false,
          message: "Account Not Found!",
        });
      }
  
      account.username = userName;
      account.firstName = firstName;
      account.lastName = lastName;
      account.password = password;
      account.photoProfile = photoProfile;
      await account.save();
  
      res.status(200).json({
        ok: true,
        message: "Account updated successfully!",
        detail: account,
      });
    } catch (error) {
      res.status(400).json({
        ok: false,
        message: "Failed to update account!",
        detail: String(error),
      });
    }
  };
  
  exports.uploadPhoto = async (req, res) => {
    const { filename } = req.file;
    const { id: accountId } = req.user;
  
    try {
      const profile = await Profile.findOne({ where: { accountId } });
      if (profile.profilePicture) {
        // delete old profile picture
        fs.rmSync(__dirname + "/../public/" + profile.profilePicture);
      }
  
      profile.profilePicture = filename;
      await profile.save();
  
      res.json({
        ok: true,
        data: "Profile picture updated",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: String(error),
      });
    }
  };