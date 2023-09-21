const StatusCode = require("http-status-codes");

const errorHandleMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCode.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again!",
  };

  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field,please choose another value`;
    customError.statusCode = 400;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandleMiddleware;
