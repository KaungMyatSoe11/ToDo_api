const express = require("express");
const { login, register, verifyEmail, checkUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login",login)
router.post("/verify-email",verifyEmail)
router.post("/check",checkUser)

module.exports = router;
