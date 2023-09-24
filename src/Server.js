const SocketChatServer = require("./utils/socketServerClass.js");
const { httpPort } = require("./utils/configServer.js");

const Server = new SocketChatServer(httpPort).init();
