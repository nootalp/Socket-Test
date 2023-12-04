const WebSocket = require("ws");
const { Client, Message } = require("../models/objectModels");

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();
    /** Ensures that the event callback references the scope of the class with 'bind()'.
     *  wss.on('connection', (ws, req) => { ... } */
    this.wss.on("connection", this.handleWebSocketConnection.bind(this));
  }

  handleWebSocketConnection(ws, req) {
    const newClient = this.createClientAttributes(ws, req).messageData;
    if (this.registerClient(newClient)) {
      this.sendConnectionMessage(ws);
      this.printConnectedClients();
    }
    ws.on("message", this.processReceivedMessage.bind(this, newClient));
    ws.on("close", this.handleClientClosure.bind(this, newClient));
  }

  printConnectedClients() {
    console.log("-------------------");
    console.log("Connected Clients:");
    for (const clientId of this.clients.keys())
      console.log(`Client ID: ${clientId}`);
    console.log("-------------------");
  }

  createClientAttributes(ws, req) {
    return new Client(ws, req.headers["user-agent"], req.socket.remoteAddress);
  }

  registerClient(client) {
    try {
      this.clients.set(client.Id, client);
      this.logClientInfo(client);
      return true;
    } catch (err) {
      console.error("Error adding client: ", err);
      return false;
    }
  }

  sendConnectionMessage(ws) {
    const jsonMessage = JSON.stringify({ connection: "ok" });
    ws.send(jsonMessage, (error) => {
      if (error) {
        console.error("Error sending message to client: ", error);
      }
    });
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
    this.clients.delete(client.Id);
    console.log(`Closing connection for client ${client.Id}`);
    this.printConnectedClients();
  }

  logClientInfo(client) {
    const { Id, connectionTime, userAgent, IpAddress } = client;
    console.log(`${Id}\n${connectionTime}\n${userAgent}\n${IpAddress}`);
  }

  decodeMessage(blobMessage) {
    return Buffer.from(blobMessage).toString("utf-8");
  }

  broadcastMessage(message, sender) {
    const canReceiveMessage = (client) =>
      client.socket !== sender && client.socket.readyState === WebSocket.OPEN;

    for (const client of this.clients.values()) {
      if (canReceiveMessage(client)) {
        client.socket.send(JSON.stringify({ content: message }));
      }
    }
  }
}

module.exports = WebSocketServer;
