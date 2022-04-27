"use strict";
const getWeb3 = require("../controllers/walletHelper");
const web3 = getWeb3();
const wallet = web3.eth.accounts.create();

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          userName: "server",
          password: "server",
          address: wallet.address,
          amount: 0,
          privateKey: wallet.privateKey,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
