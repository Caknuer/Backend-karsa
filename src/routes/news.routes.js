const express = require("express");

const router = express.Router();

const newsController =
  require("../controllers/news.controller");

  //USER
router.get(
  "/",
  newsController.getAllNews
);
router.get(
  "/:id",
  newsController.getNewsById
);
router.put(
  "/:id",
  newsController.updateNews
);
router.delete(
  "/:id",
  newsController.deleteNews
);
//ADMIN
router.post(
  "/",
  newsController.createNews
);

module.exports = router;