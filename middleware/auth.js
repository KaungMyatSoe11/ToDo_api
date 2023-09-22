const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../error");
const User = require("../models/User");
const { isTokenValid, attachCookiesToResponse } = require("../utils");
const Token = require("../models/Token");

const auth = async (req, res, next) => {
  //const authHeader = req.headers.authorization;

  const { refreshToken, accessToken } = req.signedCookies;

  // console.log(authHeader);
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   throw new UnauthenticatedError("Authentication invalid");
  // }

  // const token = authHeader.split(" ")[1];
  // console.log(token);

  try {
    // const payload = jwt.verify(token, process.env.JWT_SECRET, {
    //   algorithms: "HS256",
    // });
    // console.log({ payload });
    // const { userId } = payload;
    // const user = await User.findOne({ _id: userId });

    // if (!user) {
    //   throw new UnauthenticatedError("Authentication invalid");
    // }

    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }

    const payload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    console.log(payload);
    req.user = payload.user;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;
