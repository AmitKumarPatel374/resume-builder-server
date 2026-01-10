const express = require("express");
const { contactMailController } = require("../controllers/mail.controller");

const router = express.Router();


router.post("/contact",contactMailController);

module.exports = router;