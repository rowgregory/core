const magicLinkTemplate = (url: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Access Your Coastal Referral Exchange Account</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;" class="email-bg">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;" class="email-bg">
    <tr>
      <td style="padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px;" class="card-bg">
          <tr>
            <td style="padding: 24px;">

              <!-- Header -->
              <h1 style="margin: 0 0 12px 0; color: #0f172a; font-size: 24px; font-weight: 700; text-align: center;" class="text-dark">Welcome to Coastal Referral Exchange</h1>
              <p style="margin: 0 0 28px 0; color: #475569; font-size: 15px; line-height: 1.5; text-align: center;" class="text-gray">Your boarding link is ready.</p>

              <!-- Sign In Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding: 28px 0;">
                    <a href="${url}" style="display: inline-block; background-color: #0ea5e9; color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 16px;" class="button-bg">
                      Access The Bridge
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Benefits Section -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
                <tr>
                  <td style="padding: 16px; background-color: #ffffff; border-radius: 12px; border: 2px solid #e2e8f0;" class="gradient-box">
                    <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 600;" class="text-dark">Quick Actions Once You're In:</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.6;" class="text-gray">
                      <li>Schedule Parleys (1-2-1 meetings)</li>
                      <li>Send Treasure Maps (referrals)</li>
                      <li>Drop Anchors (thank you for closed business)</li>
                      <li>Browse the navigator directory and connect</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Alternative Link -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
                <tr>
                  <td style="padding: 14px; background: #ffffff; border-radius: 10px; border: 2px solid #e2e8f0;" class="alt-box">
                    <p style="margin: 0 0 8px 0; color: #334155; font-size: 13px; font-weight: 600;" class="text-dark">⚓ Can't click the button? Copy this link:</p>
                    <p style="margin: 0; word-break: break-all; font-family: 'SF Mono', Monaco, monospace; font-size: 11px; color: #0ea5e9; background: #f8fafc; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;" class="alt-box-inner">
                      ${url}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-top: 28px; border-top: 2px solid #f1f5f9; text-align: center;" class="border-light">
                    <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.4;" class="text-gray">
                      This secure link expires in 60 minutes for your protection.<br>
                      If you didn't request access to Coastal Referral Exchange, please disregard this email.
                    </p>
                    <p style="margin: 16px 0 0 0; color: #94a3b8; font-size: 11px;" class="text-muted">
                      © 2025 Coastal Referral Exchange • Building Business Connections by the Shore
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

export default magicLinkTemplate
