const { User } = require("../models");
const e = require("express");
const getWeb3 = require("./walletHelper");
const web3 = getWeb3();

//이번에는 ERC20의 transfer() 함수를 호출하는 setTransfer() 함수를 만들어,
// 커뮤니티 유저가 다른 유저에게 토큰을 보낼 수 있도록 합니다.
// 서버 -> 유저 토큰 제공이랑 똑같은 거 아닙니까.

module.exports = {
  tokenSend: {
    post: async (req, res) => {},
  },
};
