const { User } = require("../models");
const {
  contractABI,
  contractAddress,
} = require("../source/tokenInfomation.json");
const soketWeb3 = require("./walletHelper");
const Web3 = require("web3");

const web3 = new Web3(
  new Web3.providers.WebsocketProvider("ws://127.0.0.1:7545")
);

function watchEtherTransfers() {
  web3.eth
    .subscribe("pendingTransactions", function (error, result) {
      if (!error) {
        console.log("transaction: ", result);
      }
    })
    .on("data", async function (transaction) {
      const trx = await web3.eth.getTransaction(transaction);
      console.log(trx);
      const { from, to } = trx;

      // 토큰이라면...
      if (to === contractAddress) watchTokenTransfers();
      else {
        // 아니라면...
        const addresses = [from, to];

        addresses.forEach(async (e) => {
          const user = await User.findOne({ where: { address: e } });
          const balance = await web3.eth.getBalance(e);
          // User DB 업데이트
          if (user !== null)
            User.update({ ethAmount: balance }, { where: { address: e } });
        });
      }
      console.log("------------------------------------------------------");
    });
}

// 토큰 트잭
function watchTokenTransfers() {
  const tokenContract = new web3.eth.Contract(contractABI, contractAddress);
  tokenContract.events.Transfer({}, async (err, event) => {
    console.log("smart contract event log: ", event);
    // 에러 처리
    if (err) {
      console.log(err);
      return;
    }
    // 이벤트로 받은 내용 중에 from, to address만 발췌
    const addresses = [event.returnValues.from, event.returnValues.to];

    addresses.forEach(async (e) => {
      let amount = await tokenContract.methods.balanceOf(e).call();
      const user = await User.findOne({ where: { address: e } });
      // User DB 업데이트
      if (user !== null)
        User.update({ tokenAmount: amount }, { where: { address: e } });
    });
    console.log("------------------------------------------------------");
  });
}

watchEtherTransfers();
