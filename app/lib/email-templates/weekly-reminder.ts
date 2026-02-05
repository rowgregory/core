const weeklyReminderTemplate = (memberName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Activity Reminder - Coastal Referral Exchange</title>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">
    
    <!-- Header -->
    <div style="padding: 32px 40px; border-bottom: 1px solid #e2e8f0;">
      <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Coastal Referral Exchange</p>
      <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 600;">Weekly Activity Reminder</h1>
    </div>

    <!-- Main Content -->
    <div style="padding: 32px 40px;">
      
      <!-- Greeting -->
      <p style="margin: 0 0 24px 0; color: #334155; font-size: 16px; line-height: 1.6;">
        Hello ${memberName},
      </p>
      
      <p style="margin: 0 0 24px 0; color: #334155; font-size: 16px; line-height: 1.6;">
        This is your weekly reminder to log any recent activity. Keeping your records up to date helps you track progress and ensures your contributions are recognized.
      </p>

      <!-- Presentation Reminder -->
      <div style="margin: 0 0 24px 0; padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
        <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.6;">
          <strong>Tomorrow's Meeting:</strong> Kerry will be presenting during our morning session. Don't miss it!
        </p>
      </div>

      <!-- Activities List -->
      <div style="margin: 28px 0;">
        <p style="margin: 0 0 16px 0; color: #0f172a; font-size: 15px; font-weight: 600;">
          Activities to log:
        </p>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; width: 24px;">
              <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-top: 4px;"></div>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
              <strong style="color: #0f172a; font-size: 14px;">Treasure Maps</strong>
              <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;">Referrals given to fellow crew members</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; width: 24px;">
              <div style="width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; margin-top: 4px;"></div>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
              <strong style="color: #0f172a; font-size: 14px;">Anchors</strong>
              <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;">Thank you for closed business</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; vertical-align: top; width: 24px;">
              <div style="width: 8px; height: 8px; background: #6366f1; border-radius: 50%; margin-top: 4px;"></div>
            </td>
            <td style="padding: 12px 0;">
              <strong style="color: #0f172a; font-size: 14px;">Parleys</strong>
              <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;">Face-2-face meetings with other members</p>
            </td>
          </tr>
        </table>
      </div>

      <!-- CTA Button -->
      <div style="margin: 32px 0; text-align: center;">
        <a href="https://coastal-referral-exchange.com/auth/login" style="display: inline-block; background: #0f172a; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Log Activities
        </a>
      </div>

      <!-- Help -->
      <p style="margin: 24px 0 0 0; color: #64748b; font-size: 13px; line-height: 1.6;">
        Need assistance? Contact your chapter administrator or reply to this email.
      </p>

    </div>

    <!-- Footer -->
    <div style="padding: 24px 40px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; line-height: 1.5;">
        This reminder is sent weekly to help you stay on track.
      </p>
      <p style="margin: 0; color: #94a3b8; font-size: 11px;">
        © 2025 Coastal Referral Exchange
      </p>
    </div>

  </div>
</body>
</html>
`

export default weeklyReminderTemplate
