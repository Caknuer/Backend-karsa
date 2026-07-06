const express = require("express");

const router = express.Router();

const managementController =
require("../controllers/management.controller");

router.get(
  "/",
  managementController.getAllManagements
);

router.get(
  "/:id",
  managementController.getManagementById
);

router.post(
  "/",
  managementController.createManagement
);

router.put(
  "/:id",
  managementController.updateManagement
);

router.delete(
  "/:id",
  managementController.deleteManagement
);

module.exports = router;