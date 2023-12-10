class ClientManager {
  constructor(clientFactory) {
    this.clientFactory = clientFactory;
  }

  static decodeMessage(blobMessage) {
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
  }

  pullConnectionMessage(username) {
    return `new Client Connected! :: [${username}]`;
  }

  newConnectionMessage(client) {
    const message = this.pullConnectionMessage(client.username);
    this.broadcastMessage(message, client.socket);
  }

  processReceivedMessage(client, message) {
    if (client.username === "Default") return;
    const textMessage = this.decodeMessage(message);
    this.receiveMessage(client, textMessage);

    const messageWithSender = `[${client.username}]: ${textMessage}`;
    this.broadcastMessage(messageWithSender, client.socket);
  }

  clientInfo(client) {
    const { Id, connectionTime, userAgent, IpAddress } = client;
    console.log(`${Id}\n${connectionTime}\n${userAgent}\n${IpAddress}`);
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

  static receiveMessage(client, textMessage) {
    const receivedMessage = new Message(client.Id, textMessage).messageData;
    console.log(`[${client.username}]: ${receivedMessage.content}`);
  }
}

module.exports = ClientManager;
