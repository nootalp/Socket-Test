class User {
  constructor(id, username) {
    this.id = id;
    this.username = username;
    this.isOnline = false;
    this.lastAcess = null;
  }
}

class Message {
  constructor(senderID, content, timestamp) {
    this.senderID = senderID;
    this.content = content;
    this.timestamp = timestamp;
  }
}
