const { Client } = require("../../models/objectModels");

class ClientFactory {
  pullClientData(ws, { headers, socket }) {
    return new Client(ws, headers["user-agent"], socket.remoteAddress)
      .messageData;
  }
}

module.exports = ClientFactory;
