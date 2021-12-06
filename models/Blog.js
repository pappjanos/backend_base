const Sequelize = require("sequelize");
const db = require("../config/database");

const Blog = db.define(
  "blog",
  {
    title: {
      type: Sequelize.STRING,
    },
    text: {
      type: Sequelize.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Blog;
