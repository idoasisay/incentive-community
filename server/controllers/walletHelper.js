const Web3 = require("web3");

function getWeb3() {
  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://127.0.0.1:7545")
  );
  return web3;
}

module.exports = getWeb3;
