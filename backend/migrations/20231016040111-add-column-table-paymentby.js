"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("Transactions", "paymentBy", {
      type: Sequelize.ENUM("cash", "qris", "creditcard", "debitcard"),
      defaultValue: null,
    });
  },
  
  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("Transactions", "paymentBy");
  },
};
