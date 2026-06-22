/* eslint-disable @typescript-eslint/no-var-requires */
const { createServer } = require("node:https");
const next = require("next");
const fs = require("node:fs");

const hostname = "localhost";
const port = 3000;

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://${hostname}:${port}`);
  });
});
