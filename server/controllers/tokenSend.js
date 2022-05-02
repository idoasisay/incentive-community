const { User } = require("../models");
const web3Helper = require("./walletHelper");
const {
  contractABI,
  contractAddress,
} = require("../source/tokenInfomation.json");

const web3 = web3Helper.getWeb3();

module.exports = {
  tokenSend: {
    post: async (req, res) => {},
  },
};

// 토큰 진짜로 전송하는 건 이쪽
/*
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
      web3.eth.personal.unlockAccount(fromUser.dataValues.address, fromUser.dataValues.password, 600).then(console.log('Account unlocked!'))

      const data = contract.methods.transfer(toUser.dataValues.address, amount);
      data.send(options, (err, tx)=> {
        if(err) console.log(err);
        console.log(tx);
      })
      res.send('');
        async function getTOKENBalanceOf(address) {
          return await contract.methods.balanceOf(address).call();
        }
 */
