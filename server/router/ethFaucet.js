const router = require('express').Router();
const controller = require('../controllers/ethFaucet');

router.post('/', controller.ethFaucet.post);
router.get('/ganache', controller.ganache.get);

module.exports = router;