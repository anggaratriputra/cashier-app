const { Account } = require("../models");
const { Op } = require("sequelize");

exports.getAllCashier = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  const offset = (page - 1) * limit;

  try {
    const { count, rows: cashiers } = await Account.findAndCountAll({
      limit,
      offset,
      where: {
        isAdmin: {
          [Op.or]: [false, 0],
        },
      },
      order: [["id", "ASC"]],
    });

    if (!cashiers || cashiers.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No cashiers data found!",
      });
    }

    // Extract details for each cashier and create an array
    const cashierDetails = cashiers.map((cashier) => ({
      id: cashier.id,
      username: cashier.username,
      firstName: cashier.firstName,
      lastName: cashier.lastName,
      email: cashier.email,
      isAdmin: cashier.isAdmin,
      isActive: cashier.isActive,
      createdAt: cashier.createdAt,
      updatedAt: cashier.updatedAt,
    }));

    // Send a 200 OK status along with a JSON response including "data: ok".
    res.status(200).json({
      ok: true,
      pagination: {
        totalData: count,
        page,
      },
      details: cashierDetails,
    });
  } catch (error) {
    // Handle errors here
    console.error(error);
    res.status(500).send("Internal Server Error");
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