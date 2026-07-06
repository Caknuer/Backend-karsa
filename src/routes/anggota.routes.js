const express = require("express");
const router = express.Router();
const controller =
require("../controllers/anggotaController");

router.get("/", controller.getAll);

router.get(
  "/pending",
  controller.getPending
);
router.get(
  "/:id",
  controller.getById
);
router.put(
  "/:id",
  controller.update
);
router.put(
  "/:id/approve",
  controller.approve
);
router.put(
  "/:id/reject",
  controller.reject
);

module.exports = router;