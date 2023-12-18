httpPort = 3000;
phpPort = 8000;

domain = "localhost";

module.exports = {
  httpPort,
  __projectDirectory: process.cwd(),
  phpProxyURL: `http://${domain}:${phpPort}`,
  webSocketURL: `ws://${domain}:${httpPort}`,
  httpURL: `http://${domain}:${httpPort}`,
};
