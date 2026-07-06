const express = require("express");

const router = express.Router();

const controller =
require("../controllers/simpananController");

const checkMemberStatus =
require("../middleware/memberStatusMiddleware");

router.get("/", controller.getAll);

router.get(
  "/user/:userId/total",
  controller.getTotalByUser
);

router.get(
  "/user/:userId",
  controller.getByUser
);

router.post("/",  checkMemberStatus, controller.create);

router.put("/:id", controller.update);

router.delete("/:id", controller.remove);

module.exports = router;