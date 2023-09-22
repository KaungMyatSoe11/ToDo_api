const { UnauthenticatedError } = require("../error");
const ApiKey = require("../models/ApiKey");

const apiKey = async (req, res, next) => {
  const key = req.headers.key;
  console.log(key);

  try {
    const validApiKey=await ApiKey.findOne({api_key:key})
    
    if(!validApiKey){
      throw new UnauthenticatedError("API Key invalid")
    }
    
    next();
  } catch (err) {
    throw new UnauthenticatedError("API Key invalid");
  }
};

module.exports = apiKey;
