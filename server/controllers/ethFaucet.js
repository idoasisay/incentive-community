const models = require("../models");
const e = require("express");
const getWeb3 = require("./walletHelper");

const web3 = getWeb3();
// 가나슈 로컬 테스트넷에서 1EH 받는 API 작성
module.exports = {
  ethFaucet: {
    post: async (req, res) => {
      const { name, password } = req.body;

      try {
        const ganache = await models.Users.findOne({
          where: { userName: "ganache" },
        });
        models.Users.findOne({ where: { userName: name } }).then((data) => {
          const { userName, address, privateKey } = data;

          // 개인 계정 등록
          web3.eth.accounts.privateKeyToAccount(privateKey);

          // 수신 가나슈 => 개인 계정한테 트잭 서명
          web3.eth.accounts
            .signTransaction(
              {
                to: address,
                value: "1000000000000000000",
                gas: 2000000,
              },
              ganache.privateKey
            )
            .then((data) => {
              web3.eth.sendSignedTransaction(data.rawTransaction);
              web3.eth.getBalance(address).then((bal) => {
                res.json({
                  message: "Faucet Successed",
                  data: {
                    userName: userName,
                    address: address,
                    balance: bal,
                    txHash: data.transactionHash,
                  },
                });
              });
            });
        });
      } catch (err) {
        console.error(err);
      }
    },
  },

  // 가나슈 계정 만들기
  ganache: {
    get: async (req, res) => {
      //TODO
      const accounts = await web3.eth.getAccounts();
      // 가나슈가 있는지 확인하고 없으면 생성하자
      models.Users.findOrCreate({
        where: {
          userName: "ganache",
        },
        defaults: {
          password: "ganacheServer",
          address: accounts[0],
          privateKey:
            "4b0fa79e55dbcf1e907dbb2c87aba545780203009276e56966cc3e39d078f7c6",
        },
      }).then(([user, created]) => res.json(user));
    },
  },
};
