const express = require("express");

const router = express.Router();

const controller =
require("../controllers/tagihan.controller");

router.get("/", controller.getAllTagihan);

router.get("/status", controller.getStatus);

router.post("/generate", controller.generateTagihan);

router.post("/aktifkan", controller.aktifkanTagihan);

router.get("/dashboard", controller.getDashboard);

router.get("/detail/:userId", controller.getDetail);

router.patch("/:id/lunas", controller.bayarTagihan);

router.get("/user/:userId", controller.getByUser);

router.get("/user/:userId/summary", controller.getSummary);

module.exports = router;