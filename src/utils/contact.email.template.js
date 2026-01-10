const contactEmailTemplate = (name, email, message) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Contact Message</title>
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
        padding: 20px;
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
        font-size: 18px;
        margin-bottom: 16px;
      }
      .field {
        margin-bottom: 14px;
      }
      .label {
        font-size: 13px;
        font-weight: 600;
        color: #555;
        margin-bottom: 4px;
      }
      .value {
        font-size: 14px;
        color: #111;
        background: #f9fafb;
        padding: 10px;
        border-radius: 6px;
        line-height: 1.6;
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
        <h2>resuInstant · New Contact Message</h2>
      </div>

      <div class="content">
        <h1>You received a new message</h1>

        <div class="field">
          <div class="label">Name</div>
          <div class="value">${name}</div>
        </div>

        <div class="field">
          <div class="label">Email</div>
          <div class="value">${email}</div>
        </div>

        <div class="field">
          <div class="label">Message</div>
          <div class="value">${message}</div>
        </div>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} resuInstant · Contact Request
      </div>
    </div>
  </body>
  </html>
  `
}

module.exports = contactEmailTemplate
