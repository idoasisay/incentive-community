const router = require('express').Router();
const controller = require('../controllers/user');

// DB 들어가기 전까지 임시
const fs = require('fs');

router.post('/', controller.user.post);

module.exports = router;