const lightWallet = require("eth-lightwallet");
const models = require("../models");
const e = require("express");
const Web3 = require("web3");

function getWeb3() {
  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://127.0.0.1:7545")
  );
  return web3;
}

async function getAccounts() {
  try {
    const accounts = await getWeb3().eth.getAccounts();
    console.log(accounts);
    return accounts;
  } catch (e) {
    console.log(e);
    return e;
  }
}

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
          getWeb3().eth.accounts.privateKeyToAccount(privateKey);

          // 수신 가나슈 => 개인 계정한테 트잭 서명
          getWeb3()
            .eth.accounts.signTransaction(
              {
                to: address,
                value: "1000000000",
                gas: 2000000,
              },
              ganache.privateKey
            )
            .then((data) => {
              getWeb3().eth.sendSignedTransaction(data.rawTransaction);
              getWeb3()
                .eth.getBalance(address)
                .then((bal) => {
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
      const accounts = await getWeb3().eth.getAccounts();
      // 가나슈가 있는지 확인하고 없으면 생성하자
      models.Users.findOrCreate({
        where: {
          userName: "ganache",
        },
        defaults: {
          password: "ganacheServer",
          address: accounts[0],
          privateKey:
            "df6724dcf00c43fa0e000a01792fc830e77a7f77483376f98fbcd00203890988",
        },
      }).then(([user, created]) => res.json(user));
    },
  },
};
