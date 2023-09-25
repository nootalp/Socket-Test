const socket = new WebSocket(`ws://localhost:3000`);

socket.addEventListener("message", (event) => {
  const chat = document.getElementById("chat");
  const message = document.createElement("li");
  message.textContent = event.data;
  chat.appendChild(message);
});

function sendMessage() {
  const input = document.getElementById("message");
  const messageText = input.value.trim();

  if (!messageText) return;

  const chat = document.getElementById("chat");
  const senderMessage = document.createElement("li");
  senderMessage.textContent = "You: " + messageText;
  chat.appendChild(senderMessage);

  socket.send(messageText);
  input.value = "";
  input.focus();
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

// Adicione manipuladores de eventos aqui, como um clique em botões.
