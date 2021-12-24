const jwt = require("jsonwebtoken");
const config = require("../config/config");

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

    const verify = jwt.verify(req.token, config.jwt.secret, (err, authData) =>
      err
        ? res.status(403).json({
            message: "User is not authorized",
            msg_id: "USR_NOT_AUTHORIZED",
          })
        : true
    );
    if (verify) next();
  }
}
module.exports = verifyToken;
