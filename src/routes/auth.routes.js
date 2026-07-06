const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const verifyFirebaseToken = require("../middleware/authMiddleware");

router.get("/", (req, res) => {
  res.send("Auth Route Active");
});

router.get("/firebase-test", authController.firebaseTest);

router.get(
  "/protected",
  verifyFirebaseToken,
  authController.protected
);

router.get(
  "/profile",
  verifyFirebaseToken,
  authController.profile
);

router.put(
  "/profile",
  verifyFirebaseToken,
  authController.updateProfile
);

router.put(
  "/fcm-token",
  verifyFirebaseToken,
  authController.updateFcmToken
);

router.post(
  "/register",
  authController.register
);

router.post("/register", authController.register);

module.exports = router;