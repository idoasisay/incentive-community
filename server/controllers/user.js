const lightWallet = require('eth-lightwallet');
const models = require('../models');
const e = require('express');
const Web3 = require('web3');

module.exports = {

    user: {
        post: async (req, res) => {
            const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
            const { name, password } = req.body;
            // 유저 정보 받아오기

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
                        const wallet = web3.eth.accounts.create();
                        models.Users.update({
                            address: wallet.address,
                            privateKey: wallet.privateKey
                        }, {
                            where: {userName: name}
                        }).then(result => {
                            res.json(wallet.address);
                        }).catch(err => {
                            console.error(err);
                        })
                    }
                })
            } catch(exception) {
                console.log('error: ', exception);
            }

        }
    }
}