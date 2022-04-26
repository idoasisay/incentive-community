const lightWallet = require("eth-lightwallet");

function makeMnemonic(password) {
  console.log("2 니모닉 만드는 함수로 입장");
  // 니모닉 코드 생성
  // 여기서 리턴이 되어야 하는구나 ..

  let mnemonic;
  let result;

  mnemonic = lightWallet.keystore.generateRandomSeed();

  lightWallet.keystore.createVault(
    {
      password: password,
      seedPhrase: mnemonic,
      hdPathString: "m/0'/0'/0'",
    },
    function (err, ks) {
      ks.keyFromPassword(password, function (err, pwDerivedKey) {
        ks.generateNewAddress(pwDerivedKey, 1);

        let address = ks.getAddresses().toString();
        let keystore = ks.serialize();
        result = { address, keystore };
      });
    }
  );
}

module.exports = makeMnemonic;
