const coreTemplate = (memberName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Activity Reminder - Coastal Referral Exchange</title>
  <style type="text/css">
    @media (prefers-color-scheme: dark) {
      .email-bg { background-color: #0f172a !important; }
      .card-bg { background-color: #1e293b !important; }
      .text-dark { color: #f1f5f9 !important; }
      .text-gray { color: #cbd5e1 !important; }
      .text-muted { color: #94a3b8 !important; }
      .border-light { border-color: #334155 !important; }
      .footer-bg { background-color: #0f172a !important; }
      .notice-yellow { background-color: #422006 !important; color: #fbbf24 !important; border-color: #f59e0b !important; }
      .notice-cyan { background-color: #164e63 !important; color: #67e8f9 !important; border-color: #0e7490 !important; }
      .button-bg { background-color: #0ea5e9 !important; }
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
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;" class="text-muted">Coastal Referral Exchange</p>
              <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 600;" class="text-dark">Captain's Log</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 20px;">

              <!-- Greeting -->
              <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;" class="text-gray">
                Hi ${memberName},
              </p>

              <!-- No Meeting Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
                <tr>
                  <td style="padding: 14px; background: #ffffff; border-left: 4px solid #f59e0b; border-radius: 6px; border: 2px solid #f59e0b;" class="notice-yellow">
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                      <strong>No Meeting This Week!</strong> We're taking this week off. See you the following week!
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Upcoming Presentation Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
                <tr>
                  <td style="padding: 14px; background: #ffffff; border-left: 4px solid #0e7490; border-radius: 6px; border: 2px solid #0e7490;" class="notice-cyan">
                    <p style="margin: 0; color: #164e63; font-size: 14px; line-height: 1.6;">
                      <strong>Coming Up:</strong> Martin Connolly from Live Well Capital will be presenting at our next meeting. Don't miss it!
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Activities List -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
                <tr>
                  <td>
                    <p style="margin: 0 0 16px 0; color: #0f172a; font-size: 15px; font-weight: 600;" class="text-dark">
                      Activities to log:
                    </p>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; width: 24px;" class="border-light">
                          <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-top: 4px;"></div>
                        </td>
                        <td style="padding: 12px 0 12px 12px; border-bottom: 1px solid #f1f5f9;" class="border-light">
                          <strong style="color: #0f172a; font-size: 14px;" class="text-dark">Treasure Maps</strong>
                          <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;" class="text-gray">Referrals given to fellow crew members</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; width: 24px;" class="border-light">
                          <div style="width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; margin-top: 4px;"></div>
                        </td>
                        <td style="padding: 12px 0 12px 12px; border-bottom: 1px solid #f1f5f9;" class="border-light">
                          <strong style="color: #0f172a; font-size: 14px;" class="text-dark">Anchors</strong>
                          <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;" class="text-gray">Thank you for closed business</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; vertical-align: top; width: 24px;">
                          <div style="width: 8px; height: 8px; background: #6366f1; border-radius: 50%; margin-top: 4px;"></div>
                        </td>
                        <td style="padding: 12px 0 12px 12px;">
                          <strong style="color: #0f172a; font-size: 14px;" class="text-dark">Parleys</strong>
                          <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;" class="text-gray">Meetings with other members</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding: 24px 0;">
                    <a href="https://coastal-referral-exchange.com/auth/login" style="display: inline-block; background-color: #0ea5e9; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;" class="button-bg">
                      Log Activities
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Help -->
              <p style="margin: 20px 0 0 0; color: #64748b; font-size: 13px; line-height: 1.6;" class="text-gray">
                Need assistance? Contact Sqysh.
              </p>

            </td>
          </tr>
          <tr>
            <td style="padding: 20px; background: #ffffff; border-top: 1px solid #e2e8f0;" class="footer-bg border-light">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; line-height: 1.5;" class="text-gray">
                This reminder is sent weekly to help you stay on track.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px;" class="text-muted">
                © 2026 Coastal Referral Exchange
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

export default coreTemplate
