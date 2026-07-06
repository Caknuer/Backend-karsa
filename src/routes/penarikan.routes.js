const express = require("express");

const router = express.Router();

const controller =
require("../controllers/penarikanController");

const checkMemberStatus =
require("../middleware/memberStatusMiddleware");

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
  checkMemberStatus, controller.create
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