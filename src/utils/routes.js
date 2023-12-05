const express = require("express");
const path = require("path");
const { __projectDirectory } = require("./configServer");

let usernameFromRequest = null;

class Routes {
  constructor() {
    this.appRoutes = express.Router();
    this.projectDirectory = __projectDirectory;
    this.setupRoutes();
  }

  setupRoutes() {
    this.appRoutes
      .get("/", (_, res) =>
        res.sendFile(
          path.join(this.projectDirectory, "public", "usernameSetup.html")
        )
      )

      .post("/processUsername", (req, res) => {
        usernameFromRequest = req.body.username;
        res.redirect(
          `/public/chat.php?username=${encodeURIComponent(usernameFromRequest)}`
        );
      });
  }

  returnUsername() {
    return usernameFromRequest;
  }
}

module.exports = Routes;
