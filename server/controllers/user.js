const env = require("dotenv");
const { User } = require("../models");
const web3Helper = require("./walletHelper");

const web3 = web3Helper.getWeb3();

// 회원가입 및 지갑 생성
module.exports = {
  user: {
    post: async (req, res) => {
      try {
        // 유저 정보 받아오기
        const { name, password } = req.body;

        // 유저 확인
        User.findOrCreate({
          where: { userName: name, password: password },
          defaults: { address: "", ethAmount: "0", tokenAmount: "0" },
        }).then(async ([user, created]) => {
          // 있으면? 있다고 응답
          if (!created) {
            res.status(409).send("이미 가입된 회원입니다.");

            // 없으면 지갑 생성
          } else {
            const wallet = await web3.eth.personal.newAccount(password);

            // 유저 업데이트 -> 생성한 지갑 넣기
            User.update({ address: wallet }, { where: { userName: name } })
              // wallet.address 응답
              .then((result) =>
                res.json({
                  message: "회원가입이 완료되었습니다.",
                  data: { address: wallet },
                })
              )
              .catch((err) => console.error(err));
          }
        });
      } catch (exception) {
        console.log("error: ", exception);
      }
    },
  },
};
