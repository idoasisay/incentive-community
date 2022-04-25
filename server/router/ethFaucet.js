const router = require('express').Router();
const controller = require('../controllers/ethFaucet');

router.post('/', controller.ethFaucet.post);

module.exports = router;