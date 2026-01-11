import axios from "axios";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_API_KEY = process.env.BREVO_API_KEY;

export async function sendWelcomeEmail({ name, email }) {
  try {
    const payload = {
      sender: {
        name: "resuInstant",
        email: process.env.EMAIL,
      },
      to: [{ email, name }],
      subject: "Welcome to resuInstant",
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
                  Welcome to resuInstant
                </h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="font-size:14px;line-height:1.6;padding-bottom:16px;">
                Hello${name ? ` ${name}` : ""},
              </td>
            </tr>

            <tr>
              <td style="font-size:14px;line-height:1.6;padding-bottom:16px;">
                Your email address has been successfully verified and your
                <strong>resuInstant</strong> account is now active.
              </td>
            </tr>

            <tr>
              <td style="font-size:14px;line-height:1.6;padding-bottom:24px;">
                You can now start creating and managing professional resumes
                using our platform.
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

    console.log("WELCOME EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error(
      "Welcome email failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}
