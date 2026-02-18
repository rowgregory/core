const sqyshGoogleReviewTemplate = (memberName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Love Your Experience? Leave a Review!</title>
  <style type="text/css">
    @media (prefers-color-scheme: dark) {
      .email-bg { background-color: #0f172a !important; }
      .card-bg { background-color: #1e293b !important; }
      .text-dark { color: #f1f5f9 !important; }
      .text-gray { color: #cbd5e1 !important; }
      .text-muted { color: #94a3b8 !important; }
      .border-light { border-color: #334155 !important; }
      .footer-bg { background-color: #0f172a !important; }
      .appreciation-box { background-color: #1e3a4f !important; border-color: #10b981 !important; }
      .appreciation-text { color: #86efac !important; }
      .button-bg { background-color: #10b981 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;" class="email-bg">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;" class="email-bg">
    <tr>
      <td style="padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; margin: 0 auto; background: white; border-radius: 12px;" class="card-bg">
          <tr>
            <td style="padding: 24px 20px; border-bottom: 1px solid #e2e8f0;" class="border-light">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;" class="text-muted">Sqysh</p>
              <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 600;" class="text-dark">We'd Love Your Feedback</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 20px;">

              <!-- Greeting -->
              <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;" class="text-gray">
                Hi ${memberName},
              </p>

              <!-- Message -->
              <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;" class="text-gray">
                Thank you for choosing Sqysh for your software development needs!
              </p>

              <p style="margin: 0 0 24px 0; color: #334155; font-size: 16px; line-height: 1.6;" class="text-gray">
                If you've had a great experience working with us, we'd love a quick Google review! It helps more businesses find us and keeps us building cool solutions for awesome clients like you.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding: 24px 0;">
                    <a href="https://g.page/r/CQIcbfJ1n5hlEAI/review" 
                       style="display: inline-block; padding: 14px 28px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;" class="button-bg">
                      Leave a Google Review
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback URL -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0 0 0;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px;" class="text-muted">
                      Can't see the button? Copy and paste this URL into your browser:
                    </p>
                    <p style="margin: 0; color: #64748b; font-size: 12px; word-break: break-all;" class="text-gray">
                      https://g.page/r/CQIcbfJ1n5hlEAI/review
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Appreciation -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
                <tr>
                  <td style="padding: 16px; background: #ffffff; border: 2px solid #10b981; border-radius: 8px;" class="appreciation-box">
                    <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 1.6;" class="appreciation-text">
                      <strong>Your feedback matters!</strong> Reviews help other businesses discover quality web development services and allow us to continue doing what we love.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Closing -->
              <p style="margin: 20px 0 0 0; color: #334155; font-size: 16px; line-height: 1.6;" class="text-gray">
                Thank you for your support!<br>
                <span style="color: #64748b; font-size: 14px;" class="text-muted">— Sqysh</span>
              </p>

            </td>
          </tr>
          <tr>
            <td style="padding: 20px; background: #ffffff; border-top: 1px solid #e2e8f0;" class="footer-bg border-light">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; line-height: 1.5;" class="text-gray">
                  Need assistance? Contact Sqysh.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px;" class="text-muted">
                © 2026 Sqysh
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

export default sqyshGoogleReviewTemplate
