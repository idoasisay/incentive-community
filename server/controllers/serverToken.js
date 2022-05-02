const env = require("dotenv");
const { User } = require("../models");
const web3Helper = require("./walletHelper");
const {
  contractABI,
  contractAddress,
} = require("../source/tokenInfomation.json");

async function getServerAccount() {
  return User.findOne({
    where: { userName: "server" },
  }).then((data) => data);
}

env.config();

const web3 = web3Helper.getWeb3();

module.exports = {
  serverToken: {
    post: async (req, res) => {
      const server = await getServerAccount();

      User.findOne({ where: { userName: req.body.name } }).then((user) => {
        if (!user) res.status(409).json({ message: "유저가 없습니다." });

        const contract = new web3.eth.Contract(contractABI, contractAddress, {
          from: server.address,
        });
        const data = contract.methods
          .transfer(user.address, "1000000000000000000")
          .encodeABI();
        const rawTransaction = { to: contractAddress, gas: 100000, data: data };

        web3.eth.accounts
          .signTransaction(rawTransaction, process.env.SERVER_PRIVATEKEY)
          .then((signedTx) =>
            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
          )
          .then(async (req) => {
            const balance = await getTOKENBalanceOf(user.address);

            // 응답
            res.status(201).json({
              message: "1 TDD를 받았습니다.",
              data: {
                username: user.username,
                address: user.address,
                txHash: req.transactionHash,
                tokenBalance: balance,
              },
            });

            // 잔여 토큰 확인
            async function getTOKENBalanceOf(address) {
              return await contract.methods.balanceOf(address).call();
            }
          });
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
