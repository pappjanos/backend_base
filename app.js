const express = require("express");
const cors = require("cors");
const db = require("./config/database.js");
const User = require("./models/User");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

//test db
db.authenticate()
  .then(() => console.log("db connected"))
  .catch((err) => console.log(`Error: ${err}`));

const app = express();

app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const token = req.body.email + req.body.password;
  //res.json({ token });
  res.send(400);
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const registeredEmail = await User.findOne({
      where: { email },
    });

    if (registeredEmail) {
      res.json({ registerStatus: "FAILED" });
    } else {
      try {
        await User.create({
          email,
          password,
        });
      } catch (error) {
        console.log(error);
      }
      res.json({ registerStatus: "SUCCESS" });
    }
  } catch (error) {
    console.log(error);
  }
});

const PORT = process.env.PORT || 1111;
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
