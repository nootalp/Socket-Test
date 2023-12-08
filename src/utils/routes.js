const express = require("express");
const path = require("path");
const { __projectDirectory } = require("./configServer");
const WebSocket = require("ws");

let usernameFromRequest = null;

class Routes {
  constructor(ws = null) {
    this.appRoutes = express.Router();
    this.projectDirectory = __projectDirectory;
    this.ws = ws;
    if (this.ws) this.socketListenCommunicate();
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
        res.cookie("usernameCookie", usernameFromRequest, {
          maxAge: 900000,
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });

        res.redirect(`/public/chat.php`);
      });
  }

  socketListenCommunicate() {
    this.ws.onopen = () => {
      const data = {
        type: "RoutesConnection",
      };
      this.ws.send(JSON.stringify(data));
    };
  }

  returnUsername(req) {
    if (usernameFromRequest === "Default") {
      return req.cookies.usernameCookie;
    }
    return usernameFromRequest;
  }
}

module.exports = Routes;
