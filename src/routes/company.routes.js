const express = require("express");

const router = express.Router();

const companyController =
require("../controllers/company.controller");

router.get(
  "/",
  companyController.getProfile
);

router.put(
  "/",
  companyController.updateProfile
);

module.exports = router;