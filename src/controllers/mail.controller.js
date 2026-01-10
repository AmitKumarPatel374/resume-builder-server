const sendMail = require("../services/mail.service")
const contactEmailTemplate = require("../utils/contact.email.template")
const contactThanksEmailTemplate = require("../utils/contact.thanks.email")

const contactMailController = async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required",
      })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email address",
      })
    }

    const html = contactEmailTemplate(name, email, message)

    const subject = `New Contact Message from ${name} | resuInstant`

    // 👇 to = your inbox
    await sendMail(
      process.env.EMAIL, // same Gmail inbox
      subject,
      html
    )

    // User auto-reply
    const emailtemp = contactThanksEmailTemplate(name)
    await sendMail(email, "Thanks for contacting resuInstant", emailtemp)

    return res.status(200).json({
      message: "Thanks for contacting us! We'll get back to you soon.",
    })
  } catch (error) {
    console.error("Contact mail error:", error)
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    })
  }
}

module.exports = {contactMailController}
