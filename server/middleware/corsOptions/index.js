const config = require("../../config/config");

module.exports = () => {
  const whitelist = "*"; //config.CORS_WHITELIST ||
  const allowedHeaders = [
    "Content-Type",
    "Authorization",
    "X-Total-Count",
    "x-access-token",
    "Content-Range",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Header",
  ];
  //config.CORS_ALLOWEDHEADERS ||
  let corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin || whitelist == "*") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    preflightContinue: false,
    allowedHeaders: allowedHeaders,
  };
  return corsOptions;
};
