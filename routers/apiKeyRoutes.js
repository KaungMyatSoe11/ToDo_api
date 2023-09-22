const { Router } = require("express");
const {
  createApiKey,
  getAllApiKeys,
} = require("../controllers/apiKeyController");

const router = Router();

router.route("/").post(createApiKey).get(getAllApiKeys);

module.exports = router;
