const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Account } = require("../models");
const fs = require("fs");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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
    };

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
  const { id } = req.user;
  const { userName, firstName, lastName, password } = req.body;

  try {
    const account = await Account.findOne({ where: { id } });
    const salt = await bcrypt.genSalt(10);
    
    if (!account) {
      return res.status(404).json({
        ok: false,
        message: "Account Not Found!",
      });
    }

    // Update the account information
    account.username = userName;
    account.firstName = firstName;
    account.lastName = lastName;

    // Check if the "password" field is provided and not null
    if (password !== undefined && password !== null && password.trim() !== "") {
      const hashPassword = await bcrypt.hash(password, salt);
      account.password = hashPassword;
    }

    if (req.file) {
      account.photoProfile = req.file.filename;

    } else {
      account.photoProfile = account.photoProfile || null;
    }

    await account.save();

    res.status(200).json({
      ok: true,
      message: "Account updated successfully!",
      detail: account,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: "Failed to update account!",
      detail: String(error),
    });
  }
};

exports.getAllAccounts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort; // Get the sorting parameter from the query
  const search = req.query.search; // Get the search query from the query

  try {
    const filter = {
      where: {},
    };

    // Apply search query filter using Sequelize's Op.like
    if (search) {
      filter.where.name = {
        [Op.like]: `%${search}%`,
      };
    }

    // Include sorting options
    if (sort) {
      if (sort === "alphabetical-asc") {
        filter.order = [["name", "ASC"]];
      } else if (sort === "alphabetical-desc") {
        filter.order = [["name", "DESC"]];
      } else if (sort === "price-asc") {
        filter.order = [["price", "ASC"]];
      } else if (sort === "price-desc") {
        filter.order = [["price", "DESC"]];
      }
    }

    // Apply pagination
    filter.limit = limit;
    filter.offset = (page - 1) * limit;

    const account = await Account.findAndCountAll(filter);

    if (!account || account.count === 0) {
      return res.status(404).json({
        ok: false,
        message: "No account found!",
      });
    }

    res.status(200).json({
      ok: true,
      pagination: {
        totalData: account.count,
        page: page,
      },
      details: account.rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

exports.getSingleAccount = async (req, res) => {
  const { username } = req.params;
  const account = await Account.findOne({ where: { username } });

  if (!account) {
    return res.status(404).json({
      ok: false,
      message: "Account Not Found!",
    });
  }

  res.status(200).json({
    ok: true,
    detail: account,
  });
};


exports.initiatePasswordReset = async (req, res) => {
  try {
    const {email} = req.body;

    if (!email) {
      return res.status(400).json({ 
      ok: false,
      error: "Email is required",
    });
  }

  const user = await Account.findOne({ where: { email } });

if (!user) {
  return res.status(400).json({
   message: "User not found",
  });
}

const uniqueCode = crypto.randomBytes(20).toString('hex');

user.uniqueCode = uniqueCode; 

await user.save();

const resetLink = `http://localhost:3000/reset-password?code=${uniqueCode}`;
const transporter = nodemailer.createTransport({
service: 'Gmail',
auth: {
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  },
});

  const mailOption = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: "Password Reset",
    //sementara
    html: `Click this <a href="${resetLink}">link</a> to reset your password.`,
  };

  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json({
      message: "Reset link sent",
      data: uniqueCode
    });
  });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { uniqueCode, password } = req.body;

    if (!uniqueCode || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await Account.findOne({ where: { uniqueCode } });

    if (!user) {
      return res.status(400).json({
        message: "Invalid link",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    user.password = hashPassword;
    user.uniqueCode = null;

    await user.save();

    res.status(200).json({
      message: "Password updated",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};