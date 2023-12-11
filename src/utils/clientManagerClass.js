const { Message } = require("../models/objectModels");

class ClientManager {
  constructor(clientFactory) {
    this.clientFactory = clientFactory;
  }

  decodeMessage(blobMessage) {
    return Buffer.from(blobMessage).toString("utf-8");
  }

  connectedClients() {
    console.log("------------------------------");
    console.log("      Connected Clients       ");
    console.log("------------------------------");

    this.clientFactory.clients.size === 0
      ? console.log("No clients connected.")
      : (console.log("Client IDs:"),
        [...this.clientFactory.clients.values()].forEach((client, index) => {
          console.log(`  ${index + 1}. ${client.Id} (${client.username})`);
        }));

    console.log("------------------------------");
    return this;
  }

  newConnectionMessage(client) {
    const message = `new Client Connected! :: [${client.username}]`;
    this.broadcastMessage(message, client.socket);
    return this;
  }

  purosesuReceivedMessage(client, blobMessage) {
    if (client.username === "Default") return;
    const textMessage = this.decodeMessage(blobMessage);
    this.receiveMessage(client, textMessage);

    const messageWithSender = `[${client.username}]: ${textMessage}`;
    this.broadcastMessage(messageWithSender, client.socket);
  }

  clientJoho(client) {
    const { Id, connectionTime, userAgent, IpAddress } = client;
    console.log(`${Id}\n${connectionTime}\n${userAgent}\n${IpAddress}`);
    return this;
  }

  broadcastMessage(message, mailer) {
    const canReceiveMessage = (client) =>
      client.socket !== mailer && client.socket.readyState;

    for (const client of this.clientFactory.clients.values()) {
      if (canReceiveMessage(client)) {
        client.socket.send(JSON.stringify({ content: message }));
      }
    }
  }

  receiveMessage(client, textMessage) {
    const receivedMessage = new Message(client.Id, textMessage).messageData;
    console.log(`[${client.username}]: ${receivedMessage.content}`);
  }
}

module.exports = ClientManager;
