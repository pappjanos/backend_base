const { DataTypes, Model } = require("sequelize");
const db = require("../config/database.js");

class BlogEntry extends Model {}

BlogEntry.init(
  {
    title: {
      type: DataTypes.STRING,
    },
    text: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: "blogentry",
    freezeTableName: true,
  }
);

module.exports = BlogEntry;
