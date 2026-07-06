const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const uploadController =
  require("../controllers/upload.controller");

router.post(
  "/image",
  upload.single("file"),
  uploadController.uploadImage
);

module.exports = router;