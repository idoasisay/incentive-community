const router = require("express").Router();
const controller = require("../controllers/serverToken");

router.post("/", controller.serverToken.post);

module.exports = router;
