const express = require("express");
const router = express.Router();
const { SignupUser, LoginUser } = require("../Controllers/UserController");

router.post("/signup", SignupUser);
router.post("/login", LoginUser);

module.exports = router;