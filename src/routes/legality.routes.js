const express = require("express");

const router = express.Router();

const legalityController =
require("../controllers/legality.controller");

router.get(
  "/",
  legalityController.getLegality
);

router.put(
  "/",
  legalityController.updateLegality
);

module.exports = router;