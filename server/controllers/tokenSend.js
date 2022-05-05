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
      const { fromUserName, toUserName, amount } = req.body;
      // from 유저 -> to 유저 전송
      const fromUser = await User.findOne({
        where: { userName: fromUserName },
      });
      const toUser = await User.findOne({ where: { userName: toUserName } });

      if (!fromUser || !toUser) res.status(400).send("유저가 없습니다.");

      const options = {
        from: fromUser.dataValues.address,
        gasPrice: 100,
        gas: 100000,
      };
      // 콘트랙트 받기
      let contract = new web3.eth.Contract(contractABI, contractAddress);
      const fromaddress = await fromUser.dataValues.address;
      const frompassword = await fromUser.dataValues.password;

      await web3.eth.personal
        .unlockAccount(fromaddress, frompassword, 600)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

      const data = contract.methods.transfer(toUser.dataValues.address, amount);
      data.send(options, async (err, tx) => {
        if (err) console.log(err);
        res.status(201).json({
          message: "토큰을 성공적으로 보냈습니다.",
          data: {
            transaction: tx,
            from: fromUserName,
            to: toUserName,
            amount: amount,
            balance: await getTOKENBalanceOf(fromaddress),
          },
        });
      });
      // res.end();
      async function getTOKENBalanceOf(address) {
        return await contract.methods.balanceOf(address).call();
      }
    },
  },
};
