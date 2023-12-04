<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>WebSocket Chat</title>
    <script src="/src/processData/messageHandler.js"></script>
    <link rel="shortcut icon" href="#" />
  </head>
  <body>
  <h1>Welcome to the chat, <?php echo $_GET['username']; ?>!</h1>
    <input
      type="text"
      id="message"
      placeholder="Enter your message"
      onkeydown="handleKeyPress(event)"
    />
    <button onclick="sendMessage()">Send</button>
    <ul id="chat"></ul>
  </body>
</html>
