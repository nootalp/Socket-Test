<?php
  if (!isset($_COOKIE['usernameCookie'])) {
    header("Location: /");
    exit; 
  }
?>
<!DOCTYPE html> 
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>WebSocket Chat</title>
    <script src="/src/processData/classChatHandler.js"></script>
    <link rel="shortcut icon" href="#" />
  </head>
  <body>
  <h1>Welcome to the chat, <?php echo $_COOKIE['usernameCookie']?>!</h1>
    <form id="messageForm">
      <input
        type="text"
        id="message"
        placeholder="Enter your message"
      />
      <button type="submit">Send</button>
    </form>
    <ul id="chat"></ul>
  </body>
</html>
