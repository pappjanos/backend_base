const express = require("express");
const cors = require("cors");
const db = require("./config/database.js");
const User = require("./models/User");
const Blog = require("./models/Blog");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Op = Sequelize.Op;

const JWT_SECRET_KEY = "secretkey";

//test db
db.authenticate()
  .then(() => console.log("db connected"))
  .catch((err) => console.log(`Error: ${err}`));

const app = express();

app.use(cors());
app.use(express.json());

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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
  });
  if (!user)
    return res
      .status(401)
      .json({ message: "Not registered", msg_id: "NOT_REGISTERED" });

  bcrypt.compare(password, user.dataValues.password, (err, resolve) => {
    if (err) {
      console.log(err);
    }
    if (resolve) {
      jwt.sign(
        { user: user.dataValues },
        JWT_SECRET_KEY,
        {
          expiresIn: "3000s",
        },
        (err, token) => {
          return res.status(200).json({ message: "Login succesfull", token });
        }
      );
    } else {
      return res
        .status(401)
        .json({ message: "Password does not match", msg_id: "PWD_NOT_MATCH" });
    }
  });
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const registeredEmail = await User.findOne({
      where: { email },
    });
    if (registeredEmail) {
      return res
        .status(409)
        .json({ message: "Already registered", msg_id: "ALREADY_REGISTERED" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Database error", msg_id: "DB_ERROR" });
  }

  try {
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      try {
        if (err) throw error;
        let user = await User.create({
          email,
          password: hashedPassword,
        });
        return user
          ? res.status(200).json({
              message: "Registration successfull!",
              msg_id: "REGISTRATION_SUCCESS",
              user,
            })
          : res
              .status(500)
              .json({ message: "Database error", msg_id: "DB_ERROR" });
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ message: "Database error", msg_id: "DB_ERROR" });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Password hashing error", msg_id: "PW_HASHING_ERROR" });
  }
});

app.post("/blog-entry", async (req, res) => {
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
});

app.get("/blog-entry", async (req, res) => {
  const { userId } = req.query;
  if (!userId)
    return res
      .status(404)
      .json({ message: "UserId is missing!", msg_id: "USER_ID_MISSING" });
  const blogEntries = await Blog.findAll({ where: { user_id: userId }, order: [['createdAt', 'DESC']] });
  if (!blogEntries)
    return res.status(500).json({
      message: "Database error",
      msg_id: "DB_ERROR",
    });

  return res.status(200).json({ blogEntries });
});

app.get("/blog-entry/:id", async (req, res) => {
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
});

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
