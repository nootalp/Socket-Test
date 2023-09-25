const __projectDirectory = process.cwd();

module.exports = {
  __projectDirectory,
  httpPort: 3000 || process.env.PORT,
  get webSocketURI() {
    return `ws://localhost:${this.httpPort}/`;
  },
  get httpURI() {
    return `http://localhost:${this.httpPort}/`;
  },
};
