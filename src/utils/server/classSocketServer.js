const WebSocket = require("ws");
const ClientManager = require("../client/classClientManager");
const ClientFactory = require("../client/classClientFactory");

class SocketServer {
  constructor(httpServer) {
    this.clientFactory = new ClientFactory();
    this.clientManager = new ClientManager();
    if (httpServer) {
      this.wss = new WebSocket.Server({ server: httpServer });
      this.wss.on("connection", this.handleWebSocketConnection.bind(this));
    }
  }

  handleWebSocketConnection(ws, req) {
    const clientData = this.clientFactory.pullClientData(ws, req);

    this.clientManager.wasNotRecorded(clientData)
      ? this.handleClientConnection(ws, clientData)
      : this.blockClientDataReceipt(ws);
  }

  handleClientConnection(ws, clientData) {
    const { clientManager } = this;
    clientManager
      .newConnectionMessage(clientData)
      .clientRogu.clientJoho(clientData)
      .connectedClients();

    ws.on(
      "message",
      clientManager.purosesuReceivedMessage.bind(clientManager, clientData)
    ).on("close", this.handleClientClosure.bind(this, clientData));
  }

  blockClientDataReceipt(ws) {
    ws.send(JSON.stringify({ wasRegistered: false }));
    ws.close();
  }

  handleClientClosure({ id }) {
    this.clientManager.clients.delete(id);
    console.log(`Closing connection for ID [${id}]  ...`);
    this.clientManager.clientRogu.connectedClients();
  }
}

module.exports = SocketServer;
