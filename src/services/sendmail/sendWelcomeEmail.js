import axios from "axios";

export async function sendWelcomeEmail({ name, email }) {
  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "resuInstant",
        email: process.env.EMAIL,
      },
      to: [{ email, name }],
      subject: "Welcome to resuInstant 🎉",
      htmlContent: `
        <div style="font-family: Inter, Arial, sans-serif; padding:40px;">
          <h2>Welcome, ${name}! 🎉</h2>

          <p>
            Your email has been successfully verified and your
            <b>resuInstant</b> account is now active.
          </p>

          <p>
            You can now start building professional resumes in minutes.
          </p>

          <p style="margin-top:30px;">
            🚀 Get started now and make your next opportunity count!
          </p>

          <p style="margin-top:30px; color:#777;">
            — Team resuInstant
          </p>
        </div>
      `,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
}
