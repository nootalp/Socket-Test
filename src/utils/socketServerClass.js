const WebSocket = require("ws");
const { Client, Message } = require("../models/objectModels");

class WebSocketServer {
  /**
   * @param { http.Server } server ? HTTP server to attach the WebSocket to. */
  constructor(server) {
    /**
     * WebSocket.Server object to manage connections.
     * @type {WebSocket.Server} */
    this.wss = new WebSocket.Server({ server });

    /**
     * Map of connected clients.
     * @type {Map<string, Client>} ? Key is the client ID and the value is the client object. */
    this.clients = new Map();

    /**
     * Ensures that the event callback references the scope of the class with 'bind()'.
     * @event WebSocketServer#connection
     * @param {WebSocket} ws - WebSocket Object for client connections.
     * @param {http.IncomingMessage} req - Object to received messages. */
    this.wss.on("connection", this.handleWebSocketConnection.bind(this));
  }

  /**
   * Handles the connection of a new WebSocket client.
   * @param {WebSocket} ws ? WebSocket object for the client connection.
   * @param {http.IncomingMessage} req ? Received message object. */
  handleWebSocketConnection(ws, req) {
    const newClient = this.createClientAttributes(ws, req).messageData;
    if (this.registerClient(newClient)) {
      this.sendConnectionMessage(newClient);
      this.logConnectedClients();
    }
    ws.on("message", this.processReceivedMessage.bind(this, newClient));
    ws.on("close", this.handleClientClosure.bind(this, newClient));
  }

  logConnectedClients() {
    console.log("------------------------------");
    console.log("      Connected Clients       ");
    console.log("------------------------------");

    const connectedClients = Array.from(this.clients.keys());
    const totalClients = connectedClients.length;

    if (totalClients === 0) {
      console.log("No clients connected.");
    } else {
      console.log(`Total connected clients: ${totalClients}`);
      console.log("Client IDs:");
      connectedClients.forEach((clientId, index) => {
        console.log(`  ${index + 1}. ${clientId}`);
      });
    }

    console.log("------------------------------");
  }

  /**
   * Creates and returns the attributes of a new customer based on the given parameters.
   * @param {WebSocket} ws - WebSocket object for the client connection.
   * @param {http.IncomingMessage} req - Received message object.
   * @returns {Client} - Returns an object representing the attributes of the new client. */
  createClientAttributes(ws, req) {
    return new Client(ws, req.headers["user-agent"], req.socket.remoteAddress);
  }

  /**
   * Registers a new connected client.
   * @param {Client} client - Client object to be registered.
   * @returns {boolean} - Returns true if the client was registered successfully; otherwise, false. */
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

  /**
   * Sends a message informing that a new client is connected to all connected clients.
   * @param {Client} client - Object representing the new connected client. */
  sendConnectionMessage(client) {
    const message = `new Client Connected! : [${client.username}]`;
    this.broadcastMessage(message, client.socket);
  }

  /**
   * Processes the message received from a client.
   * Decodes the message, logs it to the console and sends the message to all connected clients.
   * @param {Client} client - Object representing the client that sent the message.
   * @param {Buffer} message - Message received from the client (in buffer format). */
  processReceivedMessage(client, message) {
    const textMessage = this.decodeMessage(message);
    this.logReceivedMessage(client, textMessage);
    const messageWithSender = `[${client.username}]: ${textMessage}`;
    this.broadcastMessage(messageWithSender, client.socket);
  }

  /**
   * Records the message received from a client in the console.
   * Creates a message object using the client ID and message content, and logs it to the console.
   * @param {Client} client - Object representing the client that sent the message.
   * @param {string} textMessage - The text of the received message. */
  logReceivedMessage(client, textMessage) {
    const receivedMessage = new Message(client.Id, textMessage).messageData;
    console.log(`[${client.username}]: ${receivedMessage.content}`);
  }

  /**
   * Handles the closing of a client connection.
   * Removes the client from the list of connected clients and records the connection closure in the console.
   * @param {Client} client - Object representing the client whose connection is being closed. */
  handleClientClosure(client) {
    this.clients.delete(client.Id);
    console.log(`Closing connection for client ${client.Id}`);
    this.logConnectedClients();
  }

  logClientInfo(client) {
    const { Id, connectionTime, userAgent, IpAddress } = client;
    console.log(`${Id}\n${connectionTime}\n${userAgent}\n${IpAddress}`);
  }

  /**
   * Decodes a message received from the client.
   * @param {Buffer} blobMessage - Encoded message received from the client.
   * @returns {string} - Returns the decoded message. */
  decodeMessage(blobMessage) {
    return Buffer.from(blobMessage).toString("utf-8");
  }

  /**
   * Sends a message to all connected clients except the sender.
   * @param {string} message - The message to be transmitted to clients.
   * @param {WebSocket} sender - The WebSocket of the message sender. */
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
