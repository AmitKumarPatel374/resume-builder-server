// src/services/mailServices/sendContactAdminEmail.js
import axios from "axios"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

export async function sendContactAdminEmail(data) {
  try {
    const payload = {
      sender: {
        name: "resuInstant",
        email: process.env.EMAIL,
      },
      to: [{ email: process.env.EMAIL }],
      subject: "New contact message received | resuInstant",
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
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

            <!-- Header -->
            <tr>
              <td style="padding-bottom:24px;">
                <h2 style="margin:0;font-size:18px;font-weight:600;">
                  New contact message
                </h2>
              </td>
            </tr>

            <!-- Info table -->
            <tr>
              <td style="padding-bottom:24px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;width:80px;">
                      Name
                    </td>
                    <td style="padding:6px 0;color:#111827;">
                      ${data.name}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">
                      Email
                    </td>
                    <td style="padding:6px 0;color:#111827;">
                      ${data.email}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding-bottom:32px;">
                <p style="
                  margin:0 0 8px;
                  font-size:14px;
                  font-weight:500;
                  color:#111827;
                ">
                  Message
                </p>
                <p style="
                  margin:0;
                  font-size:14px;
                  line-height:1.6;
                  color:#374151;
                  white-space:pre-line;
                ">
                  ${data.message}
                </p>
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

    console.log("CONTACT ADMIN EMAIL SENT:", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Contact admin email failed:", error.response?.data || error.message)
    throw error
  }
}
