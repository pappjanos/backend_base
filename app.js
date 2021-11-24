const express = require("express");
const cors = require("cors");
const db = require("./config/database.js");
const User = require("./models/User");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Op = Sequelize.Op;

const JSON_SECRET_KEY = "secretkey";

//test db
db.authenticate()
  .then(() => console.log("db connected"))
  .catch((err) => console.log(`Error: ${err}`));

const app = express();

app.use(cors());
app.use(express.json());

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  bcrypt.compare(password, user.dataValues.password, (err, resolve) => {
    if (err) {
      console.log(err);
    }
    if (resolve) {
      jwt.sign({ user: user.dataValues }, JSON_SECRET_KEY, {
        expiresIn: "3000s",
      }),
        (err, token) => {
          res.json({ success: true, user: token });
        };
    } else {
      return res.json({
        success: false,
        status: "Password does not match",
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
    res.json({ success: false, status: "Already registered" });
  } else {
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      let user = await User.create({
        email,
        password: hashedPassword,
      });
      if (user) {
        res.json({ success: true, status: "Succesfull registration" });
      } else {
        res.json({ success: false, status: "Database error" });
      }
    });
  }
});

const PORT = process.env.PORT || 1111;
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
