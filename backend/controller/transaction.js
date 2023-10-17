const { Op } = require("sequelize");
const { Product, Transaction, TransactionItem } = require("../models");

exports.handleCreateTransaction = async (req, res) => {
  const accountId = req.user.id;
  const { items, paymentType } = req.body;

  try {
    const productList = await Product.findAll({
      where: {
        id: {
          [Op.in]: items.map((item) => item.productId),
        },
      },
    });

    const totalCharge = productList.reduce((total, product) => {
      const [item] = items.filter((item) => item.productId === product.id);
      return total + product.price * item.quantity;
    }, 0);

    // Apply the 5% tax
    const totalChargeWithTax = totalCharge + totalCharge * 0.05;
    // console.log(productList, "asdasd", totalChargeWithTax);
    const transaction = new Transaction({
      totalPrice: totalChargeWithTax,
      paymentBy: paymentType,
      accountId,
    });

    // Save the transaction to the database
    const result = await transaction.save();
    // Create TransactionItems for selected products
    const transactionItems = items.map((item) => ({
      productId: item.productId,
      transactionId: result.id,
      quantity: item.quantity,
    }));

    // Bulk insert the transaction items
    await TransactionItem.bulkCreate(transactionItems);

    res.status(200).json({
      ok: true,
      message: "Transaction created!",
      detail: result,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: "Transaction failed",
      detail: String(error),
    });
  }
};

exports.handleGetAllTransactionByCashier = async (req, res) => {
  try {
    // Retrieve all transactions along with their associated TransactionItems

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;

    const filter = {
      where: {
        accountId: req.user.id,
      },
      include: [
        {
          model: Product,
          // Assuming you've defined an alias for the Product model
          through: {
            model: TransactionItem,
            as: "transactionItems", // Alias for the TransactionItem model
          },
        },
      ],
    };

    if (sort) {
      if (sort === "price-asc") {
        filter.order = [["totalPrice", "ASC"]];
      } else if (sort === "price-desc") {
        filter.order = [["totalPrice", "DESC"]];
      } else if (sort === "date-asc") {
        filter.order = [["createdAt", "ASC"]];
      } else if (sort === "date-desc") {
        filter.order = [["createdAt", "DESC"]];
      }
    }
    // Apply pagination;
    filter.limit = limit;
    filter.offset = (page - 1) * limit;

    const transactions = await Transaction.findAll(filter);
    const count = await Transaction.count({ where: filter.where });

    res.status(200).json({
      ok: true,
      pagination: {
        totalData: count,
        page: page,
      },
      message: "Transactions retrieved successfully",
      detail: transactions,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: "Failed to retrieve transactions",
      detail: String(error),
    });
  }
};

exports.handleGetAllTransaction = async (req, res) => {
  try {
    // Retrieve all transactions along with their associated TransactionItems
    const transactions = await Transaction.findAll({
      include: [
        {
          model: Product,
          // Assuming you've defined an alias for the Product model
          through: {
            model: TransactionItem,
            as: "transactionItems", // Alias for the TransactionItem model
          },
        },
      ],
    });

    res.status(200).json({
      ok: true,
      message: "Transactions retrieved successfully",
      detail: transactions,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: "Failed to retrieve transactions",
      detail: String(error),
    });
  }
};
