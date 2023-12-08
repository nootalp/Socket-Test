const WebSocket = require("ws");
const { Client, Message } = require("../models/objectModels");

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.__clients = new Map();
    this.wss.on("connection", this.handleWebSocketConnection.bind(this));
  }

  handleWebSocketConnection(ws, req) {
    ws.on("message", (message) => {
      const data = JSON.parse(message);
      if (data.type !== "RoutesConnection") {
        const newClient = this.createClientAttributes(ws, req).messageData;
        this.registerClient(newClient)
          ? this.handleRegisteredClient(ws, newClient)
          : this.handleUnregisteredClient(ws);
      } else {
        console.log("RoutesConnection received. Ignoring client creation.");
      }
    });
  }

  handleRegisteredClient(ws, newClient) {
    this.sendConnectionMessage(newClient);
    ws.send(JSON.stringify({ wasRegistered: true }));
    this.consoleConnectedClients();

    ws.on("message", this.processReceivedMessage.bind(this, newClient));
    ws.on("close", this.handleClientClosure.bind(this, newClient));
  }

  handleUnregisteredClient(ws) {
    ws.send(JSON.stringify({ wasRegistered: false }));
    ws.close();
  }

  consoleConnectedClients() {
    console.log("------------------------------");
    console.log("      Connected Clients       ");
    console.log("------------------------------");

    const totalClients = this.__clients.size;

    if (totalClients === 0) {
      console.log("No clients connected.");
    } else {
      console.log(`Total connected clients: ${totalClients}`);
      console.log("Client IDs:");
      let index = 1;
      for (const [clientId, client] of this.__clients.entries()) {
        console.log(`  ${index++}. ${clientId} (${client.username})`);
      }
    }

    console.log("------------------------------");
  }

  createClientAttributes(ws, req) {
    const { headers, socket } = req;
    return new Client(ws, headers["user-agent"], socket.remoteAddress);
  }

  registerClient(client) {
    try {
      const isUsernameTaken = [...this.__clients.values()].some(
        (existingClient) => existingClient.username === client.username
      );

      if (isUsernameTaken) {
        console.log(`Username ${client.username} is already in use.`);
        return false;
      }

      this.__clients.set(client.Id, client);
      this.consoleClientInfo(client);
      return true;
    } catch (err) {
      console.error("Error adding client: ", err);
      return false;
    }
  }

  sendConnectionMessage(client) {
    const message = `new Client Connected! [${client.username}]`;
    this.broadcastMessage(message, client.socket);
  }

  processReceivedMessage(client, message) {
    const textMessage = this.decodeMessage(message);
    this.logReceivedMessage(client, textMessage);
    const messageWithSender = `[${client.username}]: ${textMessage}`;
    this.broadcastMessage(messageWithSender, client.socket);
  }

  logReceivedMessage(client, textMessage) {
    const receivedMessage = new Message(client.Id, textMessage).messageData;
    console.log(`[${client.username}]: ${receivedMessage.content}`);
  }

  handleClientClosure(client) {
    this.__clients.delete(client.Id);
    console.log(`Closing connection for client ${client.Id}`);
    this.consoleConnectedClients();
  }

  consoleClientInfo(client) {
    const { Id, connectionTime, userAgent, IpAddress } = client;
    console.log(`${Id}\n${connectionTime}\n${userAgent}\n${IpAddress}`);
  }

  decodeMessage(blobMessage) {
    return Buffer.from(blobMessage).toString("utf-8");
  }

  broadcastMessage(message, mailer) {
    const canReceiveMessage = (client) =>
      client.socket !== mailer && client.socket.readyState === WebSocket.OPEN;

    for (const client of this.__clients.values()) {
      if (canReceiveMessage(client)) {
        client.socket.send(JSON.stringify({ content: message }));
      }
    }
  }
}

module.exports = WebSocketServer;
