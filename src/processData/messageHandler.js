const socket = new WebSocket("ws://localhost:3000");

function addToChat(message) {
  const chatElement = document.getElementById("chat");
  const messageElement = document.createElement("li");
  messageElement.textContent = message;
  chatElement.appendChild(messageElement);
}

function handleReceivedMessage(event) {
  try {
    const receivedMessage = JSON.parse(event.data);
    console.log(receivedMessage);
    if (receivedMessage.connection !== "ok") {
      addToChat(receivedMessage);
    }
  } catch (error) {
    console.error("Error to process JSON:", error);
    addToChat("Error to process message.");
  }
}

function sendMessageToServer(messageText) {
  if (!messageText.trim()) return;

  addToChat(`You: ${messageText}`);
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(messageText);
  } else {
    addToChat("Error: Connection is not open.");
  }
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    const inputMessage = document.getElementById("message").value.trim();
    sendMessageToServer(inputMessage);
    document.getElementById("message").value = "";
    document.getElementById("message").focus();
  }
}

socket.addEventListener("open", () => {
  console.log("Opened connnection.");
});

socket.addEventListener("message", handleReceivedMessage);

socket.addEventListener("close", (event) => {
  if (event.wasClean) {
    console.log("Connection closed successfully.");
  } else {
    console.log("The connection was closed unexpectedly.");
  }
});
