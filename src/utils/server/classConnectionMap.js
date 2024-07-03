class ConnectionMap {
  clients = new Map();

  isAttributeRegistered(attribute, clientData) {
    return [...this.clients.values()].some(
      (existingClient) => existingClient[attribute] === clientData
    );
  }
  wasNotRecorded({ username, id }) {
    return this.isAttributeRegistered("username", username)
      ? (console.log(`Username ${username} is already in use.`), false)
      : (this.clients.set(id, arguments[0]), true);
  }
}

module.exports = ConnectionMap;
