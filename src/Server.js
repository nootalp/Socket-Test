const SocketChatServer = require("./utils/socketServerClass.js");
const config = require("./utils/configServer.js");

const { httpPort } = config;
const Server = new SocketChatServer(httpPort).init();
