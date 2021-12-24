const express = require("express");
const config = require("./config/config");

//middlewares
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

//utilities
const httpStatus = require("http-status");

const routes = require("./routes/v1");
const db = require("./config/database.js");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const Op = Sequelize.Op;

const JWT_SECRET_KEY = "secretkey";

//test db
db.authenticate()
  .then(() => console.log("db connected"))
  .catch((err) => console.log(`Error: ${err}`));

const app = express();

//middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(xss());
app.use(compression());

if (config.env === "prod") {
  app.use(
    "/v1/auth",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      skipSuccessfulRequests: true,
    })
  );
}

// v1 api routes
app.use("/v1", routes);

app.get("/restricted", verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET_KEY, (err, authData) =>
    err
      ? res.status(403).json({
          message: "User is not authorized",
          msg_id: "USR_NOT_AUTHORIZED",
        })
      : res.json({ message: "ok", authData })
  );
});

app.post("/test", (req, res) => {
  console.log("testted");
  res.status(401).json({ data: "fasz", error: null });
});

// app.post("/blog-entry", async (req, res) => {
//   try {
//     const { id, title, text, user_id } = req.body;
//     if (!title || !text)
//       return res.status(500).json({
//         message: "Title or text is empty",
//         msg_id: "TITLE_OR_TEXT_EMPTY",
//       });
//     const blogEntry = await Blog.create({
//       title,
//       text,
//       user_id,
//     });
//     if (!blogEntry)
//       return res.status(500).json({
//         message: "Database error",
//         msg_id: "DB_ERROR",
//       });
//     return res.status(200).json({
//       message: "Blog entry added succesfully!",
//       msg_id: "BLOG_ENTRY_ADDED",
//       blogEntry,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// app.delete("/blog-entry", async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!id)
//       return res
//         .status(404)
//         .json({ message: "PostId is missing!", msg_id: "POST_ID_MISSING" });

//     await Blog.destroy({ where: { id } });
//     return res.status(200).json({
//       message: "Blog entry deleted succesfully!",
//       msg_id: "BLOG_ENTRY_DELETED",
//       id,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// app.get("/blog-entry", async (req, res) => {
//   const { userId } = req.query;
//   if (!userId)
//     return res
//       .status(404)
//       .json({ message: "UserId is missing!", msg_id: "USER_ID_MISSING" });
//   const blogEntries = await Blog.findAll({
//     where: { user_id: userId },
//     order: [["createdAt", "DESC"]],
//   });
//   if (!blogEntries)
//     return res.status(500).json({
//       message: "Database error",
//       msg_id: "DB_ERROR",
//     });

//   return res.status(200).json({ blogEntries });
// });

// app.patch("/blog-entry", async (req, res) => {
//   try {
//     const { id, title, text } = req.body;
//     if (!title && !text)
//       return res.status(500).json({
//         message: "Title and text is empty",
//         msg_id: "TITLE_AND_TEXT_EMPTY",
//       });

//     if (!id)
//       return res
//         .status(404)
//         .json({ message: "PostId is missing!", msg_id: "POST_ID_MISSING" });

//     const blogEntry = await Blog.findOne({ where: { id } });
//     if (!blogEntry)
//       return res.status(404).json({
//         message: "Blog entry not found",
//         msg_id: "BLOG_ENTRY_NOT_FOUND",
//       });

//     if (blogEntry) {
//       await Blog.update(title ? { title } : text && { text }, {
//         where: { id },
//         returning: true,
//         plain: true,
//       });

//       const updatedBlogEntry = await Blog.findOne({ where: { id } });

//       return res.status(200).json({
//         message: "Blog entry updated succesfully!",
//         msg_id: "BLOG_ENTRY_ADDED",
//         updatedBlogEntry,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Internal server error",
//       msg_id: "INTERNAL_SERVER_ERROR",
//     });
//   }
// });

// app.get("/blog-entry/:id", async (req, res) => {
//   const postId = req.params.id;

//   if (!postId)
//     return res
//       .status(404)
//       .json({ message: "PostId is missing!", msg_id: "POST_ID_MISSING" });
//   const blogEntry = await Blog.findOne({ where: { id: postId } });
//   if (!blogEntry)
//     return res.status(404).json({
//       message: "Blog entry not found",
//       msg_id: "BLOG_ENTRY_NOT_FOUND",
//     });

//   return res.status(200).json({ blogEntry });
// });

function verifyToken(req, res, next) {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader === "undefined") {
    res.status(403).json({
      message: "User is not authorized",
      msg_id: "USR_NOT_AUTHORIZED",
    });
  } else {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  }
}

const PORT = process.env.PORT || 1111;
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
