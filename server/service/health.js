const constants = require("../config/constants");

module.exports.get = (req, res, next) => {
  return new Promise((resolve, reject) => {
    res.json({
      code: constants.HTTP_200,
      message: `${constants.MSG_ALIVE}`,
    });
  });
};
