const Web3 = require("web3");

const httpWeb3 = function (host) {
  const web3 = new Web3(new Web3.providers.HttpProvider(host));
  return web3;
};

const soketWeb3 = function (host) {
  const web3 = new Web3(new Web3.providers.WebsocketProvider(host));
  return web3;
};

function getWeb3() {
  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://127.0.0.1:7545")
  );
  return web3;
}

exports.httpWeb3 = httpWeb3;
exports.soketWeb3 = soketWeb3;
exports.getWeb3 = getWeb3;
