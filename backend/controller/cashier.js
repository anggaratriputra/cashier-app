const { Account } = require("../models");
const { Op } = require("sequelize");

exports.getAllCashier = async (req, res) => {
  try {
    const cashiers = await Account.findAll({
      where: {
        isAdmin: {
          [Op.or]: [false, 0],
        },
      },
    });

    // Send a 201 Created status along with a JSON response including "data: ok".
    res.status(201).json({
      data: "ok",
      cashiers,
    });
  } catch (error) {
    // Handle errors here
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

