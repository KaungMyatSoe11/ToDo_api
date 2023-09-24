const CustomError = require("../error");
const User = require("../models/User");
const {
  createTokenUser,
  attachCookiesToResponse,
  isTokenValid,
} = require("../utils");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const { StatusCodes } = require("http-status-codes");
const Token = require("../models/Token");

const login = async (req, res) => {
  console.log("login");
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError("Please verify your email");
  }
  const tokenUser = createTokenUser(user);

  // create refresh token
  let refreshToken = "";
  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  console.log(user);

  if (!user) {
    throw new CustomError.UnauthenticatedError("Verification Failed");
  }

  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError("Verification Failed");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

const register = async (req, res) => {
  const { email, username, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequest("Email already exists");
  }

  // first registered user is an admin
  //   const isFirstAccount = (await User.countDocuments({})) === 0;
  //   const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const origin = "http://localhost:5001";
  // const newOrigin = 'https://react-node-user-workflow-front-end.netlify.app';

  // const tempOrigin = req.get('origin');
  // const protocol = req.protocol;
  // const host = req.get('host');
  // const forwardedHost = req.get('x-forwarded-host');
  // const forwardedProtocol = req.get('x-forwarded-proto');
  console.log("emailsending");
  const result = await sendVerificationEmail({
    username,
    email,
    verificationToken: verificationToken,
    origin,
  });
  console.log(result);
  await User.create({
    username,
    email,
    password,
    verificationToken,
  });
  // send verification token back only while testing in postman!!!
  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify account",
  });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

const checkUser = async (req, res) => {
  console.log(req.signedCookies);
  const { accessToken: token } = req.signedCookies;
  console.log(token);
  const tokenData = isTokenValid(token);
  const { userId } = tokenData.user;
  console.log(userId);
  const user = await User.findOne({ _id: userId });
  console.log(user);
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  res.status(StatusCodes.OK).json({ user: tokenData.user });
};

module.exports = { login, verifyEmail, register, logout, checkUser };
