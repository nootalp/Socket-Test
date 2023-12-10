const { Client } = require("../models/objectModels");

class ClientFactory {
  constructor() {
    this.clients = new Map();
  }

  pullClientData(ws, req) {
    const { headers, socket } = req;
    return new Client(ws, headers["user-agent"], socket.remoteAddress)
      .messageData;
  }

  isUsernameRegistered(username) {
    return [...this.clients.values()].some(
      (existingClient) => existingClient.username === username
    );
  }

  wasNotRecorded(client) {
    const isRegistered = this.isUsernameRegistered(client.username);
    if (isRegistered) {
      console.log(`Username ${client.username} is already in use.`);
      return false;
    }
    this.clients.set(client.Id, client);
    return true;
  }
}

module.exports = ClientFactory;
