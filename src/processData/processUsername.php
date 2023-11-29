<?php
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
      $username = $_POST['username'];
      
      header("Location: /chat.php?username=" . urlencode($username));
      exit();
    }
?>
