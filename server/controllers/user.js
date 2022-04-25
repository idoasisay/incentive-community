const walletMake = require('./walletHelper');
const lightWallet = require('eth-lightwallet');
const makeMnemonic = require('./walletHelper');
const models = require('../models');
const e = require('express');


// 
// 함수 앞에 async 예약어 설정
// http 통신을 하는 비동기 처리 코드 앞에 await
// 시간 나면 web3.eth.accounts 만들기
module.exports = {

    user: {
        post: async (req, res) => {
            // 유저 정보 받아오기
            const { name, password } = req.body;
            console.log(name, password);
            // 모듈화 나중에... => const result = await makeMnemonic(password);
            try {
                models.Users.findOrCreate({
                    where: {
                        userName: name,
                        password: password,
                    },
                    defaults: {
                        address: '',
                        privateKey: '',
                    }
                }).then(([user, created]) => {
                    if(!created) {
                        // 있다고 응답
                        res.status(409).send("User exists");
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

                                    // 유저 업뎃
                                    models.Users.update({
                                        address: address,
                                        privateKey: mnenmonic
                                    }, {where: {
                                        userName: name
                                    }
                                }).then(result => {
                                    res.json(address);
                                }).catch(err => {
                                    console.error(err);
                                })
                                });
                            }
                        );
                    }
                })
            } catch(exception) {
                console.log('error: ', exception);
            }

        }
    }
}