const express = require("express");

const router = express.Router();

const controller =
require("../controllers/transaksiController");

router.get(
  "/user/:userId",
  controller.getByUser
);

module.exports = router;