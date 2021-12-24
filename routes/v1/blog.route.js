const express = require("express");
const blogController = require("../../controllers/blog.controller");

const router = express.Router();

router.post("/blog-entry", blogController.addBlogEntry);
router.delete("/blog-entry", blogController.deleteBlogEntry);
router.get("/blog-entry", blogController.getBlogEntries);
router.patch("/blog-entry", blogController.patchBlogEntry);
router.get("/blog-entry/:id", blogController.getBlogEntry);

module.exports = router;
