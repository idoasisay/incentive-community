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
  const tokenContract = new web3.eth.Contract(contractABI, contractAddress);
  tokenContract.events.Transfer({}, (err, event) => {
    if (err) {
      console.log(err);
      return;
    }
    const { from, to, amount } = event.returnValues;
    console.log({ from, to, amount });
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
