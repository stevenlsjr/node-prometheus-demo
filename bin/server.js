const { app } = require("../src");
let port = Number.parseInt(process.env.NODE_PORT, 10);
let hostname = process.env.NODE_HOST || "localhost";
if (!port || Number.isNaN(port)) {
  port = 3000;
}

app.listen(port, hostname, (...args) => {
  const protocol = "http";
  console.log(`listening on ${protocol}://${hostname}:${port}`);
});
