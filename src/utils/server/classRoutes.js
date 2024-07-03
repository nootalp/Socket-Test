const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { webSocketURL } = require("../configServer");


let usernameFromRequest = null;

class Routes {
  constructor(ws) {
    this.appRoutes = express.Router();
    this.ws = ws;
    this.setupRoutes();
  }

  setupRoutes() {
    this.appRoutes
      .get("/", (_, res) =>
        res.sendFile(
          path.join(process.cwd(), "public", "usernameSetup.html")
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
        secure: process.env.NODE_ENV === "production",
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

  returnUsername(req) {
    if (usernameFromRequest === "Default") {
      return req.cookies.usernameCookie;
    }
    return usernameFromRequest;
  }
}

module.exports = Routes;
