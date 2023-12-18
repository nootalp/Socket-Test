const express = require("express");
const path = require("path");
const { __projectDirectory, webSocketURL } = require("./configServer");

let usernameFromRequest = null;

class Routes {
  constructor(ws) {
    this.appRoutes = express.Router();
    this.projectDirectory = __projectDirectory;
    this.ws = ws;
    if (this.ws) this.socketListenToCommunicate();
    this.setupRoutes();
  }

  setupRoutes() {
    this.appRoutes
      .get("/", (_, res) =>
        res.sendFile(
          path.join(this.projectDirectory, "public", "usernameSetup.html")
        )
      )
      .get("/ws-url", (_, res) => {
        res.json({ webSocketURL });
      })
      .post("/processUsername", this.handleProcessUsername.bind(this));
  }

  handleProcessUsername({ body, cookies }, res) {
    usernameFromRequest = body.username || cookies.usernameCookie;

    this.sendMessageToWebSocket(usernameFromRequest);

    res
      .cookie("usernameCookie", usernameFromRequest, {
        maxAge: 900000,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      })
      .redirect(`/public/chat.php`);
  }

  sendMessageToWebSocket(username) {
    const { ws } = this;
    ws.onopen = () => {
      const data = {
        type: "RoutesConnection",
      };
      ws.send(JSON.stringify(data));
    };
    const message = JSON.stringify({ usernameRegistered: username });
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(message);
    }
  }

  socketListenToCommunicate() {}

  returnUsername(req) {
    if (usernameFromRequest === "Default") {
      return req.cookies.usernameCookie;
    }
    return usernameFromRequest;
  }
}

module.exports = Routes;
