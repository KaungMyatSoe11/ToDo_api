const { StatusCodes } = require("http-status-codes");
const { CustomAPIError, BadRequest } = require("../error");
const User = require("../models/User");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

const userRegister = async (req, res) => {
  const { username, password, email } = req.body;

  const existUser = await User.findOne({ email }).select("-password");
  if (existUser) {
    throw new BadRequest("Email already exist");
  }

  const user = await User.create(req.body);
  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: user });
};

module.exports = { userRegister };
