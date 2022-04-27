const lightWallet = require("eth-lightwallet");
const { User } = require("../models");
const e = require("express");
const getWeb3 = require("./walletHelper");
const web3 = getWeb3();
const {
  contractABI,
  contractAddress,
} = require("../source/tokenInfomation.json");

async function getServerAccount() {
  return User.findOne({
    where: { userName: "server" },
  }).then((data) => data);
}

module.exports = {
  serverToken: {
    post: async (req, res) => {
      const { name } = req.body;
      const server = await getServerAccount();

      User.findOne({ where: { userName: name } }).then((user) => {
        let contract = new web3.eth.Contract(contractABI, contractAddress, {
          from: server.address,
        });

        var data = contract.methods
          .transfer(user.address, "1000000000000000000")
          .encodeABI();
        var rawTransaction = { to: contractAddress, gas: 100000, data: data };

        web3.eth.accounts
          .signTransaction(rawTransaction, server.privateKey)
          .then((signedTx) =>
            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
          )
          .then((req) => {
            getTOKENBalanceOf(user.address).then((balance) => {
              res.json({
                message: "Serving Successed",
                data: {
                  username: user.username,
                  address: user.address,
                  txHash: req.transactionHash,
                  tokenBalance: balance,
                },
              });
            });
          });

        //GET TOKEN BALANCE FUNCTION ////////////////////////////////
        async function getTOKENBalanceOf(address) {
          return await contract.methods.balanceOf(address).call();
        }
      });
    },
  },
};

/**
 * {
	message: "Serving Successed",
	data: {
		username: 'kimcoding',  // 사용자 이름
		address: '0x32482...',  // 받는 계정의 주소
		txHash: '0x234C1...'  // 트랜잭션 해시
		tokenBalance: '12', // 유저의 토큰 잔액
	}
}
 */
