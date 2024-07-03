httpPort = 3000;
phpPort = 8000;
domain = "192.168.15.158";

module.exports = {
  httpPort,
  phpProxyURL: `http://${domain}:${phpPort}`,
  webSocketURL: `ws://${domain}:${httpPort}`,
  httpURL: `http://${domain}:${httpPort}`,
};
