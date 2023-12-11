const { v4: uuidv4 } = require("uuid");
const Routes = require("../utils/routes");

class Client {
  constructor(socket, userAgent, IpAddress) {
    this.messageData = {
      socket,
      userAgent,
      IpAddress,
      connectionData: new Date(),
      Id: Client.generateClientId(),
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
