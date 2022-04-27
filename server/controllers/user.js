const { User } = require("../models");
const e = require("express");
const getWeb3 = require("./walletHelper");
const web3 = getWeb3();

module.exports = {
  user: {
    post: async (req, res) => {
      const { name, password } = req.body;

      // 유저 정보 받아오기

      try {
        User.findOrCreate({
          where: {
            userName: name,
            password: password,
          },
          defaults: {
            address: "",
            privateKey: "",
          },
        }).then(([user, created]) => {
          if (!created) {
            // 있다고 응답
            res.status(409).send("User exists");
          } else {
            const wallet = web3.eth.accounts.create();
            User.update(
              {
                address: wallet.address,
                privateKey: wallet.privateKey,
              },
              {
                where: { userName: name },
              }
            )
              .then((result) => {
                res.json(wallet.address);
              })
              .catch((err) => {
                console.error(err);
              });
          }
        });
      } catch (exception) {
        console.log("error: ", exception);
      }
    },
  },
};
