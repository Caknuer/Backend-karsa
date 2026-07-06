const express = require("express");
const router = express.Router();

const controller =
require("../controllers/transaksiSetoran.controller");

router.get("/", controller.getAll);

router.get(
  "/user/:userId",
  controller.getByUser
);
router.get(
  "/:id", 
  controller.getById
);
router.post(
  "/",
  controller.create
);
router.patch(
  "/:id/approve",
  controller.approve
);
router.patch(
  "/:id/reject",
  controller.reject
);

module.exports = router;