const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { addFeedbackController, getAllFeedbackController } = require("../controllers/feedback.controller");

const router = express.Router();

router.post("/", authMiddleware,addFeedbackController);
router.get("/data",getAllFeedbackController);

module.exports = router;