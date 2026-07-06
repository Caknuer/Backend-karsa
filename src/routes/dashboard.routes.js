const express = require("express");

const router = express.Router();

const controller =
require("../controllers/dashboardController");

router.get(
  "/",
  controller.getDashboard
);

module.exports = router;