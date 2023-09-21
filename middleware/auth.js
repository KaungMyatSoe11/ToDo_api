const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../error");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];
  console.log(token);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: "HS256",
    });
    console.log({ payload });
    const { userId } = payload;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new UnauthenticatedError("Authentication invalid");
    }
    req.user = { userId: payload.userId, name: payload.username };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;
