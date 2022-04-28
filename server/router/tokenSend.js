const router = require("express").Router();
const controller = require("../controllers/tokenSend");

router.post("/", controller.tokenSend.post);

module.exports = router;
