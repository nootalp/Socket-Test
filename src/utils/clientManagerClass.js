const ClientRogu = require("./clientRoguClass");
const ConnectionMap = require("./connectionMapClass");

class ClientManager extends ConnectionMap {
  constructor() {
    super();
    this.clientRogu = new ClientRogu(this);
  }

  decodeMessage(blobMessage) {
    return Buffer.from(blobMessage).toString("utf-8");
  }

  newConnectionMessage({ username, socket }) {
    const message = `new Client Connected! :: [${username}]`;
    this.broadcastMessage(message, socket);
    return this;
  }

  purosesuReceivedMessage({ username, socket }, blobMessage) {
    if (username === "Default") return;

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
