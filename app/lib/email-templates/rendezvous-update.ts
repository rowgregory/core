export const rendezvousUpdateTemplate = () => `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calendar Update - Coastal Referral Exchange</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
    <tr>
      <td style="padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; margin: 0 auto; background: white; border-radius: 12px;">

          <!-- Header -->
          <tr>
            <td style="padding: 24px 20px; border-bottom: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Coastal Referral Exchange</p>
              <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 600;">Captain's Log</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 24px 20px;">

              <!-- Greeting -->
              <p style="margin: 0 0 16px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                Ahoy crew,
              </p>

              <p style="margin: 0 0 24px 0; color: #334155; font-size: 15px; line-height: 1.7;">
                The calendar has been updated through <strong style="color: #0f172a;">June 1st</strong> — you can now see who's presenting at each weekly meeting. Head to the calendar to check your upcoming slot and plan accordingly.
              </p>

              <!-- Highlight box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td style="background: #f0f9ff; border-left: 3px solid #0ea5e9; border-radius: 0 8px 8px 0; padding: 14px 16px;">
                    <p style="margin: 0 0 4px 0; color: #0369a1; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">What's new</p>
                    <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6;">Each event on the calendar now shows the presenting member for that week, so you always know who's in the spotlight.</p>
                  </td>
                </tr>
              </table>

              <!-- What to do -->
              <p style="margin: 0 0 16px 0; color: #0f172a; font-size: 15px; font-weight: 600;">
                What to do now:
              </p>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; width: 24px;">
                    <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-top: 4px;"></div>
                  </td>
                  <td style="padding: 12px 0 12px 12px; border-bottom: 1px solid #f1f5f9;">
                    <strong style="color: #0f172a; font-size: 14px;">Check the calendar</strong>
                    <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;">See the full schedule of presenters through June 1st</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; width: 24px;">
                    <div style="width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; margin-top: 4px;"></div>
                  </td>
                  <td style="padding: 12px 0 12px 12px; border-bottom: 1px solid #f1f5f9;">
                    <strong style="color: #0f172a; font-size: 14px;">Note your presenting week</strong>
                    <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;">Start preparing your spotlight if you're scheduled soon</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; vertical-align: top; width: 24px;">
                    <div style="width: 8px; height: 8px; background: #6366f1; border-radius: 50%; margin-top: 4px;"></div>
                  </td>
                  <td style="padding: 12px 0 12px 12px;">
                    <strong style="color: #0f172a; font-size: 14px;">Show up for your crew</strong>
                    <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;">Attend each parley to support fellow members during their presentations</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding: 28px 0 8px 0;">
                    <a href="https://coastal-referral-exchange.com/auth/login" style="display: inline-block; background-color: #0ea5e9; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                      View Calendar
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Help -->
              <p style="margin: 20px 0 0 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                Questions about the schedule? Contact Sqysh.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px; background: #ffffff; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; line-height: 1.5;">
                You're receiving this because you're a member of Coastal Referral Exchange.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
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
