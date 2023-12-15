class ChatHandlerClass {
  constructor(url) {
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

  onMessage(event) {
    const receivedMessage = JSON.parse(event.data);
    this.handleReceivedMessage(receivedMessage);
  }

  handleReceivedMessage(receivedMessage) {
    if (receivedMessage.content) {
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

  sendMessage(messageText) {
    if (!messageText.trim()) return;

    this.addToChat(`You: ${messageText}`);
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(messageText);
    } else {
      this.addToChat("Error: Connection is not open.");
    }
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      const inputMessage = document.getElementById("message").value.trim();
      this.sendMessage(inputMessage);
      document.getElementById("message").value = "";
      document.getElementById("message").focus();
    }
  }
}

fetch("/ws-url")
  .then((response) => response.json())
  .then((data) => {
    const { webSocketURL } = data;
    new ChatHandlerClass(webSocketURL);
  })
  .catch((error) => {
    console.error("Erro ao obter a URL do WebSocket:", error);
  });
