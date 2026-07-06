const express = require("express");

const router = express.Router();

const controller =
require("../controllers/saldoController");

//Untuk Admin
router.get(
  "/",
  controller.getAllSaldo
);

router.get(
  "/:userId",
  controller.getSaldoByUser
);


module.exports = router;