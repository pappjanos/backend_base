const express = require("express");
const authRoute = require("./auth.route");
const blogRoute = require("./blog.route");
const config = require("../../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/blog",
    route: blogRoute,
  },
];

/*
const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];
*/

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  /*
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
  */
}

module.exports = router;
