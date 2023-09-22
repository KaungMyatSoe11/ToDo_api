const crypto = require("crypto");

const generateApiKey = () => {
  const key = crypto.randomBytes(32);

  const apiKey = key.toString("base64");

  return apiKey;
};

module.exports = { generateApiKey };
