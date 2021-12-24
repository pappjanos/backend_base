const express = require("express");
const blogController = require("../../controllers/blog.controller");
const router = express.Router();
const verifyToken = require("../../utils/jwt");

router
  .post("/blog-entry", verifyToken, blogController.addBlogEntry)
  .delete("/blog-entry", verifyToken, blogController.deleteBlogEntry)
  .get("/blog-entry", verifyToken, blogController.getBlogEntries)
  .patch("/blog-entry", verifyToken, blogController.patchBlogEntry)
  .get("/blog-entry/:id", verifyToken, blogController.getBlogEntry);

module.exports = router;
