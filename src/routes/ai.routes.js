const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { enhanceProfessionalSummaryController, enhanceJobDescriptionController, uploadResumeController, enhanceFeedbackMessageController } = require("../controllers/ai.controller");

const router = express.Router();


router.post("/enhance-pro-sum", authMiddleware,enhanceProfessionalSummaryController);
router.post("/enhance-job-desc", authMiddleware,enhanceJobDescriptionController);
router.post("/upload-resume",authMiddleware,uploadResumeController );
router.post("/feedback",enhanceFeedbackMessageController );

module.exports = router;