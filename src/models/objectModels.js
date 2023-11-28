const { v4: uuidv4 } = require("uuid");

class Client {
  constructor(socket, connectionTime, userAgent, clientIPAddress) {
    this.socket = socket;
    this.connectionTime = connectionTime;
    this.userAgent = userAgent;
    this.clientIPAddress = clientIPAddress;
    this.clientId = Client.generateClientId();
  }

  static generateClientId() {
    return uuidv4();
  }
}

class Message {
  constructor(senderId, content) {
    this.senderId = senderId;
    this.content = content;
    this.timestamp = new Date();
  }

  toJSON() {
    return {
      senderId: this.senderId,
      content: this.content,
      timestamp: this.timestamp,
    };
  }

  static fromJSON(json) {
    const { senderId, content } = json;
    return new Message(senderId, content);
  }
}

module.exports = {
  Client,
  Message,
};
