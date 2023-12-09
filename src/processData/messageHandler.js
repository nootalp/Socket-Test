class ClientChatHandler {
  /**
   * @constructor
   * @param {string} url ? WebSocket URL. */
  constructor(url) {
    /**
     * WebSocket object for communication with the server.
     * @type {WebSocket} */
    this.socket = new WebSocket(url);
    document.addEventListener("DOMContentLoaded", () => {
      this.initializeSocket();
      this.inputListeners();
    });
  }

  initializeSocket() {
    this.socket.addEventListener("open", () => this.onOpen());
    this.socket.addEventListener("message", (event) => this.onMessage(event));
    this.socket.addEventListener("close", (event) => this.onClose(event));
  }

  inputListeners() {
    document
      .getElementById("message")
      .addEventListener("keypress", this.handleKeyPress.bind(this));
  }

  onOpen() {
    console.log("Opened connection.");
  }

  /**
   * Handles the WebSocket message received event.
   * @param {MessageEvent} event ? Received message event. */
  onMessage(event) {
    const receivedMessage = JSON.parse(event.data);
    this.handleReceivedMessage(receivedMessage);
  }

  handleReceivedMessage(receivedMessage) {
    if (receivedMessage.content) {
      console.log("a");
      this.addToChat(receivedMessage.content);
      return;
    }

    if (receivedMessage.error) {
      console.error("Server Error:", receivedMessage.error);
      this.addToChat(`Error: ${receivedMessage.error}`);
      return;
    }

    throw new Error("Unexpected message format.");
  }

  onClose(event) {
    if (event.wasClean) {
      console.log("Connection closed successfully.");
    } else {
      console.log("The connection was closed unexpectedly.");
    }
  }

  addToChat(message) {
    const chatElement = document.getElementById("chat");
    const messageElement = document.createElement("li");
    messageElement.textContent = message;
    chatElement.appendChild(messageElement);
  }

  /**
   * Sends a message to the server.
   * @param {string} messageText ? Text of the message to be sent. */
  sendMessage(messageText) {
    if (!messageText.trim()) return;

    this.addToChat(`You: ${messageText}`);
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(messageText);
    } else {
      this.addToChat("Error: Connection is not open.");
    }
  }

  /**
   * Handles the key press event to send a message.
   * @param {KeyboardEvent} event ? Key pressed event. */
  handleKeyPress(event) {
    if (event.key === "Enter") {
      const inputMessage = document.getElementById("message").value.trim();
      this.sendMessage(inputMessage);
      document.getElementById("message").value = "";
      document.getElementById("message").focus();
    }
  }
}

new ClientChatHandler("ws://localhost:3000");
