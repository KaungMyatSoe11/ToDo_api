const jwt = require("jsonwebtoken");
const session = require('express-session')

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const isTokenValid = (token) => {
  console.log(token, process.env.JWT_SECRET);
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } });

  const refreshTokenJWT = createJWT({
    payload: {
      user,
      refreshToken,
    },
  });

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
    sameSite: "strict",
    domain:"todo.kaungmyatsoe.dev"
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + longerExp),
    sameSite: "strict",
    domain:"todo.kaungmyatsoe.dev"
  });
  res.setHeader("Access-Control-Allow-Headers", "Set-Cookie");
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
