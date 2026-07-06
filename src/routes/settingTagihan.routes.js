const express = require("express");

const router = express.Router();

const controller =
require("../controllers/settingTagihan.controller");

router.get(
  "/",
  controller.getSetting
);

router.put(
  "/",
  controller.updateSetting
);

module.exports = router;