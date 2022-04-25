const router = require('express').Router();
const controller = require('../controllers/user');

router.post('/', controller.user.post);

module.exports = router;