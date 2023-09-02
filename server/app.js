const config = require("./config/config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const db = require("./database/sql.database.js");
const timeout = require("connect-timeout");
const nodeCache = require("node-cache");

const myCache = new nodeCache();

// in-house modules
const corsOptions = require("./middleware/corsOptions");
const errorHandler = require("./middleware/errorHandler/index"); //
const port = config.PORT || 5000;
// const port = 5001;
const basePath = config.API_BASE_PATH || "/";
const checkCORS = "FALSE"; // config.CORS_ENABLED ||
const routes = require("./router/route");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.response = {};
  res.set("Cache-Control", "public, max-age=31557600");
  next();
});

app.use(
  cors({
    origin: "*",
  })
);

app.use((req, res, next) => {
  let key = "__express__" + req.originalUrl || req.url;
  let body = JSON.stringify(req.body);
  key += body;
  const cacheContent = myCache.get(key);
  if (cacheContent) {
    res.send(cacheContent);
    return;
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      myCache.set(key, body, 31557600);
      res.sendResponse(body);
    };
    next();
  }
});

routes.forEach((route) => {
  let _path = `${basePath}${route.path}`;
  app.use(_path, route.router);
});

app.use(
  config.API_BASE_PATH + "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);
// app.disable("x-powered-by");

app.use(errorHandler);

// Start the express app
app.listen(port, () =>
  console.log(`${basePath} service is now listening on port ${port}!`)
);

// app.listen(port, () =>
//   console.log(`${basePath} service is now listening on port ${port}!`)
// );
// server.setTimeout(500000);
// // app.timeout(20000000);
