const express = require("express");
const cors = require("cors");
const db = require("./config/database.js");
const User = require("./models/User");
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
    err ? res.sendStatus(403) : res.json({ message: "ok", authData })
  );
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
  });
  if (!user) return res.json({ status: "fail", msg: "Not registered" });

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
          return res.json({ status: "success", data: { token } });
        }
      );
    } else {
      return res.json({
        status: "fail",
        msg: "Password does not match",
      });
    }
  });
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const registeredEmail = await User.findOne({
    where: { email },
  });

  if (registeredEmail) {
    return res.json({ status: "fail", msg: "Already registered" });
  }

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    let user = await User.create({
      email,
      password: hashedPassword,
    });
    return user
      ? res.json({ status: "success", data: null })
      : res.json({ status: "error", msg: "Database error" });
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader === "undefined") {
    res.sendStatus(403);
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
