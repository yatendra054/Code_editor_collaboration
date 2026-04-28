export const getResetPasswordTemplate = (username, resetUrl) => {
  const subject = "🔒 Reset Your Password";
  const text = `
Hi ${username || ""},

You recently requested to reset your password for your account. Click the link below to reset it. This link will expire in 15 minutes.

${resetUrl}

If you did not request a password reset, please ignore this email or reply to let us know.

Thanks,
Your App Team
`;

  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Reset Your Password</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
          Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #0070f3;
        color: white;
        padding: 20px;
        text-align: center;
        font-size: 1.5rem;
      }
      .content {
        padding: 24px;
      }
      .button {
        display: inline-block;
        margin-top: 16px;
        padding: 12px 24px;
        background-color: #0070f3;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
      }
      .footer {
        margin-top: 24px;
        font-size: 0.875rem;
        color: #555;
      }
      @media (max-width: 600px) {
        .container {
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        Reset Your Password
      </div>
      <div class="content">
        <p>Hi ${username || "there"},</p>
        <p>
          You recently requested to reset your password for your account. Click
          the button below to reset it. This password reset link will expire in
          15 minutes.
        </p>
        <p style="text-align:center;">
          <a href="${resetUrl}" class="button">Reset My Password</a>
        </p>
        <p class="footer">
          If that button does not work, copy and paste the following link into
          your browser:
        </p>
        <p class="footer">
          <a href="${resetUrl}">${resetUrl}</a>
        </p>
        <p class="footer">
          If you did not request this password reset, please ignore this email
          or reply to let us know. This password reset link is only valid for
          the next 15 minutes.
        </p>
        <p class="footer">Thank you,<br/>CodeSync Team</p>
      </div>
    </div>
  </body>
</html>
`;

  return { subject, text, html };
};
