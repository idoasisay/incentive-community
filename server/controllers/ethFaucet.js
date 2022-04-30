const env = require("dotenv");
const { User } = require("../models");
const web3Helper = require("./walletHelper");

const web3 = web3Helper.getWeb3();

// 가나슈 로컬 테스트넷에서 1EH 받는 API 작성
module.exports = {
  ethFaucet: {
    post: async (req, res) => {
      try {
        // 유저, 가나슈 계정
        const ganache = await User.findOne({ where: { userName: "ganache" } });
        const user = await User.findOne({ where: { userName: req.body.name } });

        if (!user) res.status(409).json({ message: "유저가 없습니다." });
        else {
          const { userName, address, privateKey } = user.dataValues;

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
                  message: "1 이더 지급이 완료되었습니다.",
                  data: {
                    userName: userName,
                    address: address,
                    balance: bal,
                    txHash: data.transactionHash,
                  },
                });
              });
            });
        }
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
      User.findOrCreate({
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
