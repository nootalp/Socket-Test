const ClientRogu = require("./clientRoguClass");

class ClientManager {
  constructor() {
    this.clientRogu = new ClientRogu(this);
    this.clients = new Map();
  }

  decodeMessage(blobMessage) {
    return Buffer.from(blobMessage).toString("utf-8");
  }

  isUsernameRegistered(username) {
    return [...this.clients.values()].some(
      (existingClient) => existingClient.username === username
    );
  }

  wasNotRecorded({ username, Id }) {
    const isRegistered = this.isUsernameRegistered(username);
    if (isRegistered) {
      console.log(`Username ${username} is already in use.`);
      return false;
    }
    this.clients.set(Id, arguments[0]);
    return true;
  }

  newConnectionMessage({ username, socket }) {
    const message = `new Client Connected! :: [${username}]`;
    this.broadcastMessage(message, socket);
    return this;
  }

  purosesuReceivedMessage({ username, socket }, blobMessage) {
    // if (username === "Default") return;

    const textMessage = this.decodeMessage(blobMessage);
    this.clientRogu.receiveMessage({ username, socket }, textMessage);

    const messageWithSender = `[${username}]: ${textMessage}`;
    this.broadcastMessage(messageWithSender, socket);
  }

  broadcastMessage(message, mailer) {
    /** Disrupt client object. */
    const canReceiveMessage = ({ socket }) =>
      socket && socket !== mailer && socket.readyState;

    for (const { socket } of this.clients.values()) {
      if (canReceiveMessage({ socket })) {
        socket.send(JSON.stringify({ content: message }));
      }
    }
  }
}

module.exports = ClientManager;
