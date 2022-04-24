const walletMake = require('./walletHelper');
const lightWallet = require('eth-lightwallet');

// DB 설정 전까지 임시
const makeMnemonic = require('./walletHelper');


// 함수 앞에 async 예약어 설정
// http 통신을 하는 비동기 처리 코드 앞에 await
// 시간 나면 web3.eth.accounts 만들기
module.exports = {

    user: {
        post: async (req, res) => {
            // 유저 정보 받아오기
            const { name, password } = req.body;
            // 모듈화 나중에... => const result = await makeMnemonic(password);
            try {
                if(database) {
                    // 아이디가 없으면 무시! 
                } else {
                    // 랜덤 시드문구 생성
                    const mnenmonic = lightWallet.keystore.generateRandomSeed();
    
                    // 지갑 생성
                    lightWallet.keystore.createVault(
                        {
                            password: password,
                            seedPhrase: mnenmonic,
                            hdPathString: "m/0'/0'/0'"
                        },
                        function (err, ks) {
                            ks.keyFromPassword(password, function (err, pwd) {
                                ks.generateNewAddress(pwd, 1);
    
                                let address = (ks.getAddresses()).toString();
                                let keystore = ks.serialize();
    
                                database[count] = {name, password, address, "privateKey": mnenmonic};
                                count++;
                                res.json(address);
                            });
                        }
                    );
                }
            } catch(exception) {
                console.log('error: ', exception);
            }

        }
    }
}