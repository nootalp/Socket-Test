const { Message } = require("../models/objectModels");

class ClientRogu {
  constructor(clientManager) {
    this.clientManager = clientManager;
  }

  receiveMessage({ username, Id }, textMessage) {
    const receivedMessage = new Message(Id, textMessage).messageData;
    console.log(`[${username}]: ${receivedMessage.content}`);
  }

  clientJoho({ Id, connectionData, userAgent, IpAddress }) {
    console.log(`${Id}\n${connectionData}\n${userAgent}\n${IpAddress}`);
    return this;
  }

  connectedClients() {
    console.log("------------------------------");
    console.log("      Connected Clients       ");
    console.log("------------------------------");

    if (this.clientManager.clients.size === 0) {
      console.log("No clients connected.");
    } else {
      console.log("Client IDs:");
      let index = 1;
      this.clientManager.clients.forEach(({ username }, id) => {
        console.log(`  ${index++}. ${id} (${username})`);
      });
    }

    console.log("------------------------------");
    return this;
  }
}
module.exports = ClientRogu;
