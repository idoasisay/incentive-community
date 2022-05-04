const env = require("dotenv");
const { User } = require("../models");
const web3Helper = require("./walletHelper");
const {
  contractABI,
  contractAddress,
  erc721Address,
  erc721ABI,
} = require("../source/tokenInfomation.json");
const Web3 = require("web3");
const user = require("./user");
const { raw } = require("mysql");
const web3 = new Web3(
  new Web3.providers.WebsocketProvider("ws://127.0.0.1:7545")
);

env.config();

// 일정량의 토큰을 주면, NFT를 발급해 주는 서비스 NFT 1개당 100 토큰입니다.
module.exports = {
  buyNft: {
    post: async (req, res) => {
      const { name, tokenURL } = req.body;
      User.findOne({ where: { userName: name } }).then(async (user) => {
        const options = {
          from: user.address,
          gasPrice: 100,
          gas: 100000,
        };

        // 유저 주소로 approve
        let contract = new web3.eth.Contract(contractABI, contractAddress);
        let contract721 = new web3.eth.Contract(erc721ABI, erc721Address);
        web3.eth.personal
          .unlockAccount(user.address, user.password, 600)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });

        contract.methods
          .approve(erc721Address, "100000000000000000001")
          .send(options, (err, tx) => {
            if (err) console.log(err);
          });

        const allowance = await contract.methods
          .allowance(user.address, erc721Address)
          .call();

        // console.log(allowance);
        const data721 = contract721.methods
          .mintNFT(user.address, tokenURL)
          .encodeABI();
        // console.log(data721);

        const rawTransaction = {
          to: erc721Address,
          gas: 1000000,
          data: data721,
        };
        // console.log(rawTransaction);

        web3.eth.accounts
          .signTransaction(rawTransaction, process.env.SERVER_PRIVATEKEY)
          .then((signedTx) =>
            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
          )
          .then(async (req) => {
            console.log(req);
            res.json({
              message: "NFT를 생성했습니다.",
              data: { transaction: req.transactionHash },
            });
          });
      });
    },
  },
};
