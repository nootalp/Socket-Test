const express = require("express");
const path = require("path");
const appRoutes = express.Router();
const { __projectDirectory } = require("./configServer");

/** Routes. */
appRoutes
  .get("/", (_, res) =>
    res.sendFile(
      path.join(__projectDirectory, "public", "markup", "index.html")
    )
  )
  .use(
    "/public",
    express.static(path.join(__projectDirectory, "public"), {
      "Content-Type": "text/javascript",
    })
  );

module.exports = appRoutes;
