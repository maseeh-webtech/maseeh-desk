import * as express from "express";
import * as httpProxy from "http-proxy-middleware";
import Bundler from "parcel-bundler";

const bundler = new Bundler("src/index.html");

const app = express();

const proxy = httpProxy({
  target: `http://localhost:3000`,
});

// Proxy requests to the server
app.use("/api", proxy);
app.use("/auth", proxy);

app.use(bundler.middleware());

const port = Number(process.env.PORT || 1234);
app.listen(port);
console.log(`Visit http://localhost:${port}`);
