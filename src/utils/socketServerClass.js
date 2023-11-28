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
    const newClient = this.createClient(ws, req);
    if (this.addClient(newClient)) {
      this.sendConnectionMessage(ws);
    }

    ws.on("message", this.handleReceivedMessage.bind(this, newClient));
    ws.on("close", this.handleClientClosure.bind(this, newClient));
  }

  createClient(ws, req) {
    return new Client(
      ws,
      new Date(),
      req.headers["user-agent"],
      req.socket.remoteAddress
    );
  }

  addClient(newClient) {
    try {
      this.clients.set(newClient.clientId, newClient);
      this.logClientInfo(newClient);
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

  handleReceivedMessage(client, message) {
    try {
      const textMessage = this.decodeMessage(message);
      const receivedMessage = new Message(client.clientId, textMessage);
      console.log(`[${client.clientId}]: ${receivedMessage.content}`);
      this.broadcastMessage(textMessage, client.socket);
    } catch (err) {
      console.error("Error decoding message: ", err);
    }
  }

  handleClientClosure(client) {
    this.clients.delete(client.clientId);
    console.log(`Closing connection for client ${client.clientId}`);
  }

  logClientInfo(client) {
    const { clientId, connectionTime, userAgent, clientIPAddress } = client;
    console.log(
      `${clientId}\n${connectionTime}\n${userAgent}\n${clientIPAddress}`
    );
  }

  decodeMessage(blobMessage) {
    return Buffer.from(blobMessage).toString("utf-8");
  }

  broadcastMessage(message, sender) {
    const canReceiveMessage = (client) =>
      client.socket !== sender && client.socket.readyState === WebSocket.OPEN;

    for (const client of this.clients.values()) {
      if (canReceiveMessage(client)) {
        client.socket.send(message);
      }
    }
  }
}

module.exports = WebSocketServer;
