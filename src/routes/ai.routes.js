const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { enhanceProfessionalSummaryController, enhanceJobDescriptionController, uploadResumeController } = require("../controllers/ai.controller");

const router = express.Router();


router.post("/enhance-pro-sum", authMiddleware,enhanceProfessionalSummaryController);
router.post("/enhanced-job-desc", authMiddleware,enhanceJobDescriptionController);
router.post("/upload-resume",authMiddleware,uploadResumeController );

module.exports = router;