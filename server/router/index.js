const express = require('express');
const router = express.Router();
const walletRouter = require('./wallet');
const userRouter = require('./user');

// TODO: Endpoint에 따라 적절한 Router로 연결해야 합니다.
router.get('/', (res, req) => req.send('first page test'));
router.use('/wallet', walletRouter);
router.use('/user', userRouter);

module.exports = router;