const { v4: uuidv4 } = require("uuid");
const Routes = require("../utils/server/routes");

class Client {
  constructor(socket, userAgent, ipAddress) {
    this.messageData = {
      socket,
      userAgent,
      ipAddress,
      connectionData: new Date(),
      id: Client.generateClientId(),
      username: new Routes().returnUsername() || "Default",
    };
  }

  static generateClientId() {
    return uuidv4();
  }
}

class Message {
  constructor(senderId, content) {
    this.messageData = {
      senderId,
      content,
      timestamp: new Date(),
    };
  }

  static toJSON() {
    return { ...this.messageData };
  }
}

module.exports = {
  Client,
  Message,
};
