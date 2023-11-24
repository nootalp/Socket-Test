const socket = new WebSocket(`ws://localhost:3000`);

socket.addEventListener("message", (event) => {
  const chat = document.getElementById("chat");
  chat.innerHTML += `<li>${event.data}</li>`;
});

socket.addEventListener("close", (event) => {
  if (event.wasClean) {
    console.log("Connection closed sucessfully.");
  }
});

function sendMessage() {
  const input = document.getElementById("message");
  const messageText = input.value.trim();

  if (!messageText) return;

  const chat = document.getElementById("chat");
  chat.innerHTML += `<li>You: ${messageText}</li>`;

  socket.send(messageText);
  input.value = "";
  input.focus();
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}
