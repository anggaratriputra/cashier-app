"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.removeColumn("Categories", "isEditing");
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.addColumn('Categories', 'isEditing', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  },
};
