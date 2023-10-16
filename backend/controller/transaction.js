const { Op } = require("sequelize");
const { Product, Transaction, TransactionItem } = require("../models");

exports.handleCreateTransaction = async (req, res) => {
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
