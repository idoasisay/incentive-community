const router = require("express").Router();
const controller = require("../controllers/buyNft");

router.post("/", controller.buyNft.post);

module.exports = router;
