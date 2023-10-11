const { Op } = require("sequelize");
const { Account } = require("../models");
const bcrypt = require("bcrypt");

exports.getAllCashiers = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort; // Get the sorting parameter from the query
  const search = req.query.search; // Get the search query from the query

  try {
    const filter = {
      where: {
        isAdmin: false, // Adding the condition to filter by isAdmin = false
      },
    };

    // Apply search query filter using Sequelize's Op.or to search across multiple fields
    if (search) {
      filter.where[Op.or] = [
        {
          username: { [Op.like]: `%${search}%` },
        },
        {
          lastName: { [Op.like]: `%${search}%` },
        },
        {
          firstName: { [Op.like]: `%${search}%` },
        },
      ];
    }

    // Include sorting options
    if (sort) {
      if (sort === "alphabetical-asc") {
        filter.order = [["username", "ASC"]];
      } else if (sort === "alphabetical-desc") {
        filter.order = [["username", "DESC"]];
      }
    }

    // Apply pagination
    filter.limit = limit;
    filter.offset = (page - 1) * limit;

    const cashiers = await Account.findAndCountAll(filter);

    if (!cashiers || cashiers.count === 0) {
      return res.status(404).json({
        ok: false,
        message: "No cashiers found!",
      });
    }

    res.status(200).json({
      ok: true,
      pagination: {
        totalData: cashiers.count,
        page: page,
      },
      details: cashiers.rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

// Function to toggle the isActive status of a cashier
exports.toggleCashierStatus = async (req, res) => {
  const { cashierId } = req.params; // Assuming the cashierId is passed as a URL parameter

  try {
    // Find the cashier by ID
    const cashier = await Account.findByPk(cashierId);

    if (!cashier) {
      return res.status(404).json({
        ok: false,
        message: "Cashier not found!",
      });
    }

    // Check if the cashier is an admin (isAdmin is true)
    if (cashier.isAdmin) {
      return res.status(400).json({
        ok: false,
        message: "Cannot toggle status for admin cashiers.",
      });
    }

    // Toggle the isActive status
    const updatedStatus = !cashier.isActive;
    await cashier.update({ isActive: updatedStatus });

    // Send a success response with the updated status
    res.status(200).json({
      ok: true,
      message: `Cashier status updated to ${updatedStatus ? "Active" : "Inactive"}.`,
    });
  } catch (error) {
    // Handle errors here
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};



exports.handleRegister = async (req, res) => {
  const { firstName, lastName, username, password, email } = req.body;

  const existingAccount = await Account.findOne({
    where: {
      [Op.or]: [{ username }, { email }],
    },
  });

  if (existingAccount) {
    return res.status(400).json({
      ok: false,
      error: "Username, email or phone number already exists",
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const cashier = await Account.create({
      firstName,
      lastName,
      username,
      password: hashPassword,
      email,
      isAdmin: false,
      isActive: true,
    });
    res.json({
      ok: true,
      details: {
        username: cashier.username,
        email: cashier.email,
        firstName: cashier.firstName,
        lastName: cashier.lastName,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      ok: false,
      message: String(error),
    });
  }
};
