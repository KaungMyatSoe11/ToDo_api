const { StatusCodes } = require("http-status-codes");
const ApiKey = require("../models/ApiKey");
const { generateApiKey } = require("../utils");

const createApiKey = async (req, res) => {
  req.body.api_key = await generateApiKey();
  const apiKey = await ApiKey.create(req.body);
  res.status(StatusCodes.CREATED).json({ apiKey });
};

const getAllApiKeys = async (req, res) => {
  const apiKeys = await ApiKey.find({}).populate({
    path: "user",
    select: "username",
  });

  res.status(StatusCodes.CREATED).json({ apiKeys });
};
module.exports = {
  createApiKey,
  getAllApiKeys,
};
