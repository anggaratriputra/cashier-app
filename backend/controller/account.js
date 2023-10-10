const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Account } = require("../models");
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
          password,
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
  const { username } = req.params;
  const { userName, firstName, lastName, password, photoProfile } = req.body;

  console.log(req.file);

  try {
    const account = await Account.findOne({ where: { username } });
    console.log(account);
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
    res.status(404).json({
      ok: false,
      message: "Account Not Found!",
    });
  }

  res.status(200).json({
    ok: true,
    detail: account,
  });

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
};
