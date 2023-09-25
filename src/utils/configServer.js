const projectDirectory = process.cwd();

module.exports = {
  __dirname: projectDirectory,
  httpPort: 3000 || process.env.PORT,

  get URI() {
    return `http://localhost:${this.httpPort}/`;
  },
};
