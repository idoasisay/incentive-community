const express = require("express");
const router = express.Router();
const signUpRouter = require("./signUp");
const ethFaucetRouter = require("./ethFaucet");
const serverTokenRouter = require("./serverToken");
const tokenSendRouter = require("./tokenSend");
const buyNftRouter = require("./buyNft");

// TODO: Endpoint에 따라 적절한 Router로 연결해야 합니다.
router.get("/", (res, req) => req.send("first page test"));

router.use("/signUp", signUpRouter);
router.use("/ethFaucet", ethFaucetRouter);
router.use("/serverToken", serverTokenRouter);
router.use("/tokenSend", tokenSendRouter);
router.use("/buyNft", buyNftRouter);

module.exports = router;
