import "dotenv/config"
console.log("REDIS HOST:", process.env.REDIS_HOST)
console.log("REDIS PORT:", process.env.REDIS_PORT)
console.log("REDIS PASSWORD EXISTS:", !!process.env.REDIS_PASSWORD)
import { Worker } from "bullmq"
import connection from "../config/bullmq-connection.js"
import { sendContactAdminEmail } from "../services/sendmail/sendContactAdminEmail.js"
import { sendContactUserEmail } from "../services/sendmail/sendContactUserEmail.js"
import { sendThanksFeedbackEmail } from "../services/sendmail/sendThanksFeedbackEmail.js"
import { sendVerifyEmailOtp } from "../services/sendmail/sendVerifyEmailOtp.js"
import { sendWelcomeEmail } from "../services/sendmail/sendWelcomeEmail.js"

new Worker(
  "email-queue",
  async (job) => {
    if (job.name === "contact-email") {
      await sendContactAdminEmail(job.data)
      await sendContactUserEmail(job.data)
    } else if (job.name === "thanks-feedback") {
      await sendThanksFeedbackEmail(job.data)
    } else if (job.name === "verify-email") {
      await sendVerifyEmailOtp(job.data)
    } else if (job.name === "welcome-email") {
      await sendWelcomeEmail(job.data)
    } else {
      console.warn("⚠️ Unknown job type:", job.name)
    }
  },
  { connection, concurrency: 3 }
)

console.log("📨 Resume-Builder Email Worker running")
