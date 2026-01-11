import axios from "axios";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

export async function sendThanksFeedbackEmail(data) {
  try {
    const payload = {
      sender: {
        name: "resuInstant",
        email: process.env.EMAIL,
      },
      to: [
        {
          email: data.email,
          name: "User",
        },
      ],
      subject: "Thank You for Your Feedback 💙",
      htmlContent: `
        <div style="font-family: Inter, Arial, sans-serif; background:#ffffff; padding:40px;">
          <h2 style="color:#111;">Thank You for Your Feedback!</h2>

          <p style="font-size:16px; color:#444;">
            Hi there 👋,
          </p>

          <p style="font-size:16px; color:#444;">
            Thank you for taking the time to share your feedback with <b>resuInstant</b>.
            Your suggestions and thoughts help us improve and build a better experience for everyone.
          </p>

          <p style="font-size:16px; color:#444;">
            We truly appreciate your support and trust in our platform.
          </p>

          <p style="margin-top:30px; font-size:14px; color:#777;">
            — Team <b>resuInstant</b><br/>
            Build resumes faster & smarter 🚀
          </p>
        </div>
      `,
    };

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("THANKS FEEDBACK EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error(
      "Thanks feedback email failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}
