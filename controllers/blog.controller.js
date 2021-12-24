const Blog = require("../models/Blog");

const addBlogEntry = async (req, res) => {
  try {
    const { id, title, text, user_id } = req.body;
    if (!title || !text)
      return res.status(500).json({
        message: "Title or text is empty",
        msg_id: "TITLE_OR_TEXT_EMPTY",
      });
    const blogEntry = await Blog.create({
      title,
      text,
      user_id,
    });
    if (!blogEntry)
      return res.status(500).json({
        message: "Database error",
        msg_id: "DB_ERROR",
      });
    return res.status(200).json({
      message: "Blog entry added succesfully!",
      msg_id: "BLOG_ENTRY_ADDED",
      blogEntry,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteBlogEntry = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id)
      return res
        .status(404)
        .json({ message: "PostId is missing!", msg_id: "POST_ID_MISSING" });

    await Blog.destroy({ where: { id } });
    return res.status(200).json({
      message: "Blog entry deleted succesfully!",
      msg_id: "BLOG_ENTRY_DELETED",
      id,
    });
  } catch (error) {
    console.log(error);
  }
};

const getBlogEntries = async (req, res) => {
  const { userId } = req.query;
  if (!userId)
    return res
      .status(404)
      .json({ message: "UserId is missing!", msg_id: "USER_ID_MISSING" });
  const blogEntries = await Blog.findAll({
    where: { user_id: userId },
    order: [["createdAt", "DESC"]],
  });
  if (!blogEntries)
    return res.status(500).json({
      message: "Database error",
      msg_id: "DB_ERROR",
    });

  return res.status(200).json({ blogEntries });
};

const patchBlogEntry = async (req, res) => {
  try {
    const { id, title, text } = req.body;
    if (!title && !text)
      return res.status(500).json({
        message: "Title and text is empty",
        msg_id: "TITLE_AND_TEXT_EMPTY",
      });

    if (!id)
      return res
        .status(404)
        .json({ message: "PostId is missing!", msg_id: "POST_ID_MISSING" });

    const blogEntry = await Blog.findOne({ where: { id } });
    if (!blogEntry)
      return res.status(404).json({
        message: "Blog entry not found",
        msg_id: "BLOG_ENTRY_NOT_FOUND",
      });

    if (blogEntry) {
      await Blog.update(title ? { title } : text && { text }, {
        where: { id },
        returning: true,
        plain: true,
      });

      const updatedBlogEntry = await Blog.findOne({ where: { id } });

      return res.status(200).json({
        message: "Blog entry updated succesfully!",
        msg_id: "BLOG_ENTRY_ADDED",
        updatedBlogEntry,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      msg_id: "INTERNAL_SERVER_ERROR",
    });
  }
};

const getBlogEntry = async (req, res) => {
  const postId = req.params.id;

  if (!postId)
    return res
      .status(404)
      .json({ message: "PostId is missing!", msg_id: "POST_ID_MISSING" });
  const blogEntry = await Blog.findOne({ where: { id: postId } });
  if (!blogEntry)
    return res.status(404).json({
      message: "Blog entry not found",
      msg_id: "BLOG_ENTRY_NOT_FOUND",
    });

  return res.status(200).json({ blogEntry });
};

module.exports = {
  addBlogEntry,
  deleteBlogEntry,
  getBlogEntries,
  patchBlogEntry,
  getBlogEntry,
};
