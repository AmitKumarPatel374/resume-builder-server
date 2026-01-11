import axios from "axios";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

export async function sendVerifyEmailOtp({ email, otp, otpExpiry }) {
  try {
    const expiryMinutes = Math.max(
      1,
      Math.floor((new Date(otpExpiry).getTime() - Date.now()) / 60000)
    );

    const payload = {
      sender: {
        name: "resuInstant",
        email: process.env.EMAIL,
      },
      to: [{ email }],
      subject: "Verify your email address | resuInstant",
      htmlContent: `
<!DOCTYPE html>
<html>
  <body style="
    margin:0;
    padding:0;
    background:#ffffff;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
    color:#111827;
  ">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

            <!-- Header -->
            <tr>
              <td style="padding-bottom:24px;">
                <h2 style="margin:0;font-size:18px;font-weight:600;">
                  Verify your email address
                </h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="font-size:14px;line-height:1.6;padding-bottom:16px;">
                Thank you for signing up with <strong>resuInstant</strong>.
              </td>
            </tr>

            <tr>
              <td style="font-size:14px;line-height:1.6;padding-bottom:16px;">
                To complete your registration, please use the verification code below.
              </td>
            </tr>

            <!-- OTP -->
            <tr>
              <td style="padding:16px 0 24px;">
                <div style="
                  display:inline-block;
                  font-size:20px;
                  letter-spacing:4px;
                  font-weight:600;
                  padding:10px 14px;
                  border:1px solid #e5e7eb;
                  background:#f9fafb;
                ">
                  ${otp}
                </div>
              </td>
            </tr>

            <tr>
              <td style="font-size:13px;color:#374151;line-height:1.6;padding-bottom:24px;">
                This verification code will expire in
                <strong>${expiryMinutes} minutes</strong>.
              </td>
            </tr>

            <!-- Security note -->
            <tr>
              <td style="font-size:13px;color:#374151;line-height:1.6;padding-bottom:24px;">
                If you did not create an account with resuInstant, you can safely ignore
                this email.
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="
                font-size:12px;
                color:#6b7280;
                border-top:1px solid #e5e7eb;
                padding-top:16px;
                line-height:1.6;
              ">
                Team <strong>resuInstant</strong><br/>
                Build resumes faster & smarter
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
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
