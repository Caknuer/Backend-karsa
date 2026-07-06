const express = require("express");

const router = express.Router();

const controller =
require("../controllers/roleadmin.controller");

const adminAuthMiddleware =
require("../middleware/adminAuthMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

router.get(
  "/",
  adminAuthMiddleware,
  controller.getAllAdmins
);

router.get(
  "/:id",
  adminAuthMiddleware,
  controller.getAdminById
);

router.post(
  "/",
  adminAuthMiddleware,
  roleMiddleware(["super_admin"]),
  controller.createAdmin
);

router.put(
  "/:id",
  adminAuthMiddleware,
  roleMiddleware([
    "super_admin"
  ]),
  controller.updateAdmin
);

router.patch(
  "/:id/status",
  adminAuthMiddleware,
  roleMiddleware(["super_admin"]),
  controller.changeStatus
);

router.delete(
  "/:id",
  adminAuthMiddleware,
  roleMiddleware(["super_admin"]),
  controller.deleteAdmin
);

module.exports = router;