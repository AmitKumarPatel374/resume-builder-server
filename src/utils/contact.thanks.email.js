const contactThanksEmailTemplate = (name) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Thanks for contacting resuInstant</title>
    <style>
      body {
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: #f5f7fa;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(90deg, #16a34a, #22c55e);
        padding: 24px 20px;
        text-align: center;
      }
      .header h2 {
        color: white;
        font-size: 22px;
        font-weight: 600;
        margin: 0;
      }
      .content {
        padding: 30px;
        color: #333333;
      }
      .content h1 {
        font-size: 20px;
        margin-bottom: 12px;
      }
      .content p {
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 16px;
        color: #444;
      }
      .highlight {
        background: #f0fdf4;
        border-left: 4px solid #22c55e;
        padding: 12px 14px;
        border-radius: 6px;
        font-size: 14px;
        color: #166534;
        margin-top: 20px;
      }
      .footer {
        font-size: 13px;
        color: #777;
        text-align: center;
        padding: 18px;
        background-color: #f9fafb;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>resuInstant</h2>
      </div>

      <div class="content">
        <h1>Hello ${name}, 👋</h1>

        <p>
          Thank you for reaching out to <strong>resuInstant</strong>.  
          We’ve received your message and truly appreciate you taking the time to contact us.
        </p>

        <p>
          Our team will review your message and get back to you as soon as possible.
          If your query is urgent, please allow some time for a response.
        </p>

        <div class="highlight">
          🚀 Meanwhile, feel free to continue building and improving your resume using resuInstant.
        </div>

        <p>
          Thanks again for connecting with us — we’re glad to have you here!
        </p>

        <p>
          Best regards,<br />
          <strong>Team resuInstant</strong>
        </p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} resuInstant · All rights reserved
      </div>
    </div>
  </body>
  </html>
  `
}

module.exports = contactThanksEmailTemplate
