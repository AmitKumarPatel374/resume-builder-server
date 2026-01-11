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
          name: data.name || "User",
        },
      ],
      subject: "Thank you for your feedback | resuInstant",
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
                  Thank you for your feedback
                </h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="font-size:14px;line-height:1.6;padding-bottom:16px;">
                Hello${data.name ? ` ${data.name}` : ""},
              </td>
            </tr>

            <tr>
              <td style="font-size:14px;line-height:1.6;padding-bottom:16px;">
                Thank you for taking the time to share your feedback with
                <strong>resuInstant</strong>.
              </td>
            </tr>

            <tr>
              <td style="font-size:14px;line-height:1.6;padding-bottom:24px;">
                Your input helps us improve the platform and deliver a better
                experience for all users.
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

    console.log("THANK YOU FEEDBACK EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error(
      "Thanks feedback email failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}
