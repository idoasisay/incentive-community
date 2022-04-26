const lightWallet = require("eth-lightwallet");
const models = require("../models");
const e = require("express");
const Web3 = require("web3");

module.exports = {
  serverToken: {
    post: async (req, res) => {
      //TODO
      // 1. 입력받은 username을 가지고 데이터베이스에 저장되어 있는 주소를 가져옵니다.
      const { name } = req.body;

      // 2. 개인키를 사용해 트랜잭션에 서명을 하고
      // ERC20 컨트랙트의 transfer() 함수를 호출하는 트랜잭션을 보냅니다.

      // 컨트랙트의 transfer() 함수를 사용해 서버 계정에 있는 토큰 1개를 사용자의 주소로 전송합니다.
      // POST /ethFaucet과 동일한 방식으로 트랜잭션에 서명을 하고 보냅니다.
      // 컨트랙트에 있는 함수를 실행하기 위해서는 트랜잭션에 data 값을 추가해야 합니다.
      // https://ethereum.stackexchange.com/questions/95218/how-can-i-transfer-tokens-of-my-erc20-automatically-from-the-server
      // 컨트랙트의 balanceOf() 함수를 사용하면 특정 주소에 있는 토큰의 갯수를 확인할 수 있습니다.

      // 3. 트랜잭션의 결과에 따라 응답합니다.
    },
  },
};
