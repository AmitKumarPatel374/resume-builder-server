import axios from "axios"

const BREVO_URL = "https://api.brevo.com/v3/smtp/email"
const BREVO_API_KEY = process.env.BREVO_API_KEY

export async function sendForgotPasswordLinkEmail({ email, userName, resetLink }) {
  try {
    const payload = {
      sender: {
        name: "resuInstant",
        email: process.env.EMAIL,
      },
      to: [{ email }],
      subject: "Password reset request for your resuInstant account",
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
                  Reset your password
                </h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="font-size:14px;line-height:1.6;padding-bottom:16px;">
                Hello${userName ? ` ${userName}` : ""},
              </td>
            </tr>

            <tr>
              <td style="font-size:14px;line-height:1.6;padding-bottom:16px;">
                We received a request to reset the password for your resuInstant account.
              </td>
            </tr>

            <tr>
              <td style="font-size:14px;line-height:1.6;padding-bottom:24px;">
                To proceed, click the button below. This link will expire in
                <strong>5 minutes</strong>.
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td style="padding-bottom:32px;">
                <a
                  href="${resetLink}"
                  style="
                    display:inline-block;
                    padding:10px 18px;
                    background:#111827;
                    color:#ffffff;
                    text-decoration:none;
                    font-size:14px;
                    font-weight:500;
                    border-radius:4px;
                  "
                >
                  Reset password
                </a>
              </td>
            </tr>

            <!-- Security note -->
            <tr>
              <td style="font-size:13px;color:#374151;line-height:1.6;padding-bottom:24px;">
                If you did not request this change, you can safely ignore this email.
                Your password will remain unchanged.
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
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("FORGOT PASSWORD EMAIL SENT:", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Forgot password link email failed:", error.response?.data || error.message)
    throw error
  }
}
