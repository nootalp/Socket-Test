const projectDirectory = process.cwd();

module.exports = {
  __dirname: projectDirectory,
  httpPort: 3000,

  get URI() {
    return `http://localhost:${this.httpPort}/`;
  },
};
