const ClientRogu = require("./clientRoguClass");
const ConnectionMap = require("../server/connectionMapClass");

class InvalidSocket extends Error {
  constructor(message, code) {
    super(message);
    this.name = this.constructor.name;
    this.code = code || 500;
    this.date = new Date();
  }
}

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

  async broadcastMessage(message, mailer) {
    try {
      const canReceiveMessage = ({ socket, mailer }) => {
        return socket && socket !== mailer && socket.readyState;
      };

      await Promise.all(
        Array.from(this.clients.values())
          .filter((client) =>
            canReceiveMessage({ socket: client.socket, mailer })
          )
          .map(
            ({ socket }) =>
              new Promise((resolve, reject) =>
                socket.send(JSON.stringify({ content: message }), (error) =>
                  error
                    ? reject(new InvalidSocket("Error sending message"))
                    : resolve()
                )
              )
          )
      );
      return true;
    } catch (error) {
      console.error("Error to send message:", error);
      throw error;
    }
  }
}

module.exports = ClientManager;
