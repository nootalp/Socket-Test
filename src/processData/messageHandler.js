const socket = new WebSocket(`ws://localhost:3000`);

socket.onmessage = function (event) {
  try {
    const receivedMessage = JSON.parse(event.data);
    console.log(receivedMessage);
  } catch (error) {
    console.log("Received non-JSON message:", event.data);
  }
};

socket.addEventListener("message", (event) => {
  const chat = document.getElementById("chat");
  if (event.data === JSON.stringify({ connection: "ok" })) return;
  else chat.innerHTML += `<li>${event.data}</li>`;
});

socket.addEventListener("close", (event) => {
  if (event.wasClean) {
    console.log("Connection closed sucessfully.");
  }
});

function getUsername() {
  var username = window.username;
  return username;
}

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
