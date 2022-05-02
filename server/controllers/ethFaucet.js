const env = require("dotenv");
const { User } = require("../models");
const web3Helper = require("./walletHelper");
const web3 = web3Helper.getWeb3();

env.config();

// 가나슈 로컬 테스트넷에서 1EH 받는 API 작성
module.exports = {
  ethFaucet: {
    post: async (req, res) => {
      try {
        // 유저
        const user = await User.findOne({ where: { userName: req.body.name } });

        if (!user) res.status(409).json({ message: "유저가 없습니다." });
        else {
          const { userName, address } = user.dataValues;

          // 수신 가나슈 => 개인 계정한테 트잭 서명
          web3.eth.accounts
            .signTransaction(
              {
                to: address,
                value: "10000000000000000",
                gas: 2000000,
              },
              process.env.GANACHE_PRIVATEKEY
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
      // 어카운트 중 1개만 빼옴
      const accounts = await web3.eth.getAccounts();
      // 해당 계좌 잔액 확인
      const balance = await web3.eth.getBalance(accounts[0]);

      // 가나슈가 있는지 확인하고 없으면 생성하자
      User.findOrCreate({
        where: {
          userName: "ganache",
        },
        defaults: {
          password: "ganacheServer",
          address: accounts[0],
          ethAmount: balance,
          tokenAmount: "0"
        },
      }).then(([user, created]) => res.status(200).json(user));
    },
  },
};
