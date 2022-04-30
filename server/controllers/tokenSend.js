const { User } = require("../models");
const web3Helper = require("./walletHelper");
const {
  contractABI,
  contractAddress,
} = require("../source/tokenInfomation.json");

const web3 = web3Helper.getWeb3();

module.exports = {
  tokenSend: {
    post: async (req, res) => {
      // "1000000000000000000"
      const { fromUserName, toUserName, amount } = req.body;
      // from 유저 -> to 유저 전송
      const fromUser = await User.findOne({where: { userName: fromUserName }});
      const toUser = await User.findOne({ where: { userName: toUserName } });

      if(!fromUser || !toUser) res.status(409).send('유저가 없습니다.');

      const options = {
        from: fromUser.dataValues.address,
        gasPrice: 100,
        gas: 100000
      }

      // 콘트랙트 받기
      let contract = new web3.eth.Contract(contractABI, contractAddress);
      // web3.eth.personal.newAccount(password, [callback])

      const data = contract.methods.transfer(toUser.dataValues.address, '10000000000');
      data.send(options)
      console.log(data);
      res.send('');
        async function getTOKENBalanceOf(address) {
          return await contract.methods.balanceOf(address).call();
        }
    },
  },
};

// //
// var rawTransaction = { to: contractAddress, gas: 100000, data: data };

// web3.eth.accounts
//   .signTransaction(rawTransaction, fromUser.dataValues.privateKey)
//   .then((signedTx) =>
//     web3.eth.sendSignedTransaction(signedTx.rawTransaction)
//   )
//   .then((req) => {
//     getTOKENBalanceOf(toUser.dataValues.address).then((balance) => {
//       res.json({
//         message: `${balance}`,
//       });
//     });
//   });
//   async function getTOKENBalanceOf(address) {
//     return await contract.methods.balanceOf(address).call();
//   }
// },
// },