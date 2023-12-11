const { Client } = require("../models/objectModels");

class ClientFactory {
  pullClientData(ws, req) {
    const { headers, socket } = req;
    return new Client(ws, headers["user-agent"], socket.remoteAddress)
      .messageData;
  }
}

module.exports = ClientFactory;
