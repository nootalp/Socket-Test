const express = require("express");
const path = require("path");
const appRoutes = express.Router();
const { __projectDirectory } = require("./configServer");

/** Routes. */
appRoutes
  .get("/", (_, res) =>
    res.sendFile(path.join(__projectDirectory, "public", "usernameSetup.html"))
  )
  .post("/processUsername", (req, res) => {
    const username = req.body.username;
    res.redirect(`/public/chat.php?username=${encodeURIComponent(username)}`);
  });

module.exports = appRoutes;
