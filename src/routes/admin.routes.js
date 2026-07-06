const express = require("express");

const router = express.Router();

const controller =
require("../controllers/admin.controller");

const adminAuthMiddleware =
require("../middleware/adminAuthMiddleware");

router.post(
  "/login",
  controller.login
);

router.get(
  "/me",
  adminAuthMiddleware,
  (req, res) => {

    res.json({
      success: true,
      admin: req.admin
    });

  }
);

module.exports = router;