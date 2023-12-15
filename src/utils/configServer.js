httpPort = 3000;

module.exports = {
  httpPort,
  __projectDirectory: process.cwd(),
  phpProxyURL: `http://localhost:8000`,
  webSocketURL: `ws://localhost:${httpPort}`,
  httpURL: `http://localhost:${httpPort}`,
};
