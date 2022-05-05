const { User } = require("../models");
const {
  contractABI,
  contractAddress,
  erc721ABI,
  erc721Address,
} = require("../source/tokenInfomation.json");

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
      if (to === contractAddress)
        watch20Transfers(contractAddress, contractABI);
      else if (to === erc721Address) {
        watch721Transfers(
          erc721Address,
          erc721ABI,
          contractAddress,
          contractABI
        );
      } else {
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
function watch20Transfers(CA, ABI) {
  const tokenContract = new web3.eth.Contract(ABI, CA);
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

// 여기엔 20 트잭 따로 가지고 와야 하네요 ;
async function watch721Transfers(CA721, ABI721, CA20, ABI20) {
  const tokenContract = new web3.eth.Contract(ABI721, CA721);
  const contract20 = new web3.eth.Contract(ABI20, CA20);
  const serverAddress = await User.findOne({ where: { userName: "server" } });

  tokenContract.events.Transfer({}, async (err, event) => {
    console.log("smart contract event log: ", event);
    // 에러 처리
    if (err) {
      console.log(err);
      return;
    }
    const addresses = [serverAddress.dataValues.address, event.returnValues.to];

    addresses.forEach(async (e) => {
      let amount = await contract20.methods.balanceOf(e).call();
      let amount721 = await tokenContract.methods.balanceOf(e).call();
      const user = await User.findOne({ where: { address: e } });
      // User DB 업데이트
      if (user !== null)
        User.update(
          { tokenAmount: amount, nft: amount721 },
          { where: { address: e } }
        );
    });
    console.log("------------------------------------------------------");
  });
}

watchEtherTransfers();
