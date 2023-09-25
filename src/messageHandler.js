const socket = new WebSocket(`ws://localhost:3000`);

socket.addEventListener("message", (event) => {
  const chat = document.getElementById("chat");
  const message = document.createElement("li");

  const text = event.data;
  message.textContent = text;

  chat.appendChild(message);
});

function sendMessage() {
  const input = document.getElementById("message");
  const message = input.value;

  const chat = document.getElementById("chat");
  const senderMessage = document.createElement("li");
  senderMessage.textContent = "You: " + message;
  chat.appendChild(senderMessage);

  socket.send(message);
  input.value = "";

  input.focus();
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}
