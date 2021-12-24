const config = require("./config");
const Sequelize = require("sequelize");

module.exports = new Sequelize(
  config.db.name,
  config.db.userName,
  config.db.pass,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    operatorAliases: config.db.operatorAliases,

    pool: {
      max: config.db.pool.max,
      min: config.db.pool.min,
      acquire: config.db.pool.acquire,
      idle: config.db.pool.idle,
    },
  }
);
