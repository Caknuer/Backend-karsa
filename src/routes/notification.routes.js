const express = require("express");

const router = express.Router();

const notificationController =
require("../controllers/notification.controller");

const verifyFirebaseToken =
require("../middleware/authMiddleware");

// =========================
// GET NOTIFICATION BY USER
// =========================
router.get(
  "/",
  verifyFirebaseToken,
  notificationController.getMyNotifications
);

// =========================
// CREATE NOTIFICATION
// =========================
router.post(
  "/",
  notificationController.create
);

// =========================
// MARK AS READ
// =========================
router.patch(
  "/:id/read",
  notificationController.markAsRead
);

// =========================
// MARK ALL AS READ
// =========================
router.patch(
  "/read-all",
  verifyFirebaseToken,
  notificationController.markAllAsRead
);

module.exports = router;