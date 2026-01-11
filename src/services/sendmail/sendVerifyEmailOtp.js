import axios from "axios";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

export async function sendVerifyEmailOtp({ email, otp, otpExpiry }) {
  try {
    const expiryMinutes = Math.floor(
      (new Date(otpExpiry).getTime() - Date.now()) / 60000
    );

    const payload = {
      sender: {
        name: "resuInstant",
        email: process.env.EMAIL,
      },
      to: [
        {
          email,
          name: "User",
        },
      ],
      subject: "Verify Your Email Address - resuInstant",
      htmlContent: `
        <div style="font-family: Inter, Arial, sans-serif; background:#ffffff; padding:40px;">
          
          <h2 style="color:#111;">Verify Your Email Address</h2>

          <p style="font-size:16px; color:#444;">
            Thanks for signing up with <b>resuInstant</b> 👋
          </p>

          <p style="font-size:16px; color:#444;">
            Please use the OTP below to verify that this email address belongs to you:
          </p>

          <div style="
            margin:30px 0;
            font-size:28px;
            letter-spacing:6px;
            font-weight:bold;
            color:#000;
          ">
            ${otp}
          </div>

          <p style="font-size:15px; color:#555;">
            ⏱ This OTP will expire in <b>${expiryMinutes} minutes</b>.
          </p>

          <p style="font-size:14px; color:#777; margin-top:20px;">
            If you did not request this verification, please ignore this email.
          </p>

          <hr style="margin:30px 0;" />

          <p style="font-size:14px; color:#777;">
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

    console.log("VERIFY EMAIL OTP SENT:", response.data.messageId);
    return response.data;

  } catch (error) {
    console.error(
      "Verify email OTP failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}
