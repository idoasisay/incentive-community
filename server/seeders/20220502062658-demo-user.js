'use strict';
const getWeb3 = require("../controllers/walletHelper");
const web3 = getWeb3.getWeb3();
const wallet = web3.eth.accounts.create();

var fs = require('fs');

fs.appendFile('.env', `\nSERVER_PRIVATEKEY=${wallet.privateKey}`,function (err){
    if (err) throw err;
    console.log('update');
});

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          userName: "server",
          password: "server",
          address: wallet.address,
          ethAmount: "0",
          tokenAmount: "0",
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
