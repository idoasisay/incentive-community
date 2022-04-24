const express = require('express');
const router = express.Router();
const signUpRouter = require('./signUp');

// TODO: Endpoint에 따라 적절한 Router로 연결해야 합니다.
router.get('/', (res, req) => req.send('first page test'));

// 으악.. 회원가입 페이지를 만들어야 할 거 같은데...
router.use('/signUp', signUpRouter);

// 나중에 유저별 처리해 줘야 함
// router.use('/user:id', userRouter);

module.exports = router;