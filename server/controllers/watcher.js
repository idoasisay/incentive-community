const Web3 = require("web3");
const { User } = require("../models");
const {
  contractABI,
  contractAddress,
} = require("../source/tokenInfomation.json");
const getWeb3 = require("./walletHelper");

const GANACHE_SERVER_SOCKET = "ws://127.0.0.1:7545";
const provider = new Web3.providers.WebsocketProvider(GANACHE_SERVER_SOCKET);
const web3 = new Web3(provider);

function watchEtherTransfers() {
  // 컨트랙트 접근
  const tokenContract = new web3.eth.Contract(contractABI, contractAddress);

  // 컨트랙트에 Transfer 이벤트에 listen
  tokenContract.events.Transfer({}, async (err, event) => {
    // 에러 처리
    if (err) {
      console.log(err);
      return;
    }

    // 이벤트로 받은 내용 중에 from, to address만 발췌
    const { from, to } = event.returnValues;

    // 발췌한 주소로 토큰 확인
    let toAmount = await tokenContract.methods.balanceOf(to).call();
    let fromAmount = await tokenContract.methods.balanceOf(from).call();

    // String 처리를 해 줬어야 했는데... Number 처리... DB 수정하면 변경
    fromAmount = fromAmount / 1000000000000000000;
    toAmount = toAmount / 1000000000000000000;

    // User 확인
    const fromUser = await User.findOne({ where: { address: from } });
    const toUser = await User.findOne({ where: { address: to } });

    // User DB 업데이트
    if (fromUser !== null)
      User.update({ amount: fromAmount }, { where: { address: from } });
    if (toUser !== null)
      User.update({ amount: toAmount }, { where: { address: to } });
  });
}

module.exports = {
  watchEtherTransfers,
};

/**
  const subscription = web3.eth
    .subscribe("pendingTransactions", function (error, result) {
      console.log(result);
    })
    .on("data", async function (transaction) {
      //
      console.log(transaction);
      console.log(11);
      const trx = await web3.eth.getTransaction(transaction);
      console.log(trx);
    });

  subscription.unsubscribe(function (error, success) {
    if (success) console.log("Successfully unsubscribed!");
  });
 */

/**
  //console.log(tokenContract);

  // const subscription = web3.eth.subscribe("pendingTransactions");
  // subscription
  //   .subscribe((err, result) => {
  //     if (err) console.log(err);
  //   })
  //   .on("data", async (txHash) => {

  //     const web3Http = new Web3(GANACHE_SERVER);
  //     const trx = await web3Http.eth.getTransaction(txHash);

  //     const { hash, from, to, blockNumber, value } = trx;
  //     console.log({ hash, from, to, blockNumber, value });

  //     const fromBalance = await web3.eth.getBalance(to);
  //     console.log(fromBalance);
  //     subscription.unsubscribe();
  //   });
   */
