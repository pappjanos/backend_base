const Sequelize = require("sequelize");
const db = require("../config/database");

const User = db.define(
  "user",
  {
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = User;
