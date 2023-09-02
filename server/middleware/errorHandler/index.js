const constants = require("../../config/constants");
const errorHandler = (error, req, res, next) => {
console.error("err from error handler", error.code);
return res.status(error?.code || constants.HTTP_500).send({"error": true, "message": error?.message || "Internal Server Error"});
}

module.exports = errorHandler;