const presentingTemplate = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meeting Update - Coastal Referral Exchange</title>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">
    
    <!-- Header -->
    <div style="padding: 32px 40px; border-bottom: 1px solid #e2e8f0;">
      <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Coastal Referral Exchange</p>
      <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 600;">Meeting Update</h1>
    </div>

    <!-- Main Content -->
    <div style="padding: 32px 40px;">
      
      <!-- Greeting -->
      <p style="margin: 0 0 24px 0; color: #334155; font-size: 16px; line-height: 1.6;">
        Hello CORE,
      </p>
      <!-- No Meeting Notice -->
      <div style="margin: 28px 0; padding: 20px; background: linear-gradient(135deg, #0e7490 0%, #0284c7 100%); border-radius: 12px;">
        <div style="text-align: center;">
          <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 18px; font-weight: 600;">
            No Meeting Next Week
          </p>
          <p style="margin: 0; color: #a5f3fc; font-size: 14px; line-height: 1.6;">
            We're taking next week off. We'll see everyone the following week!
          </p>
        </div>
      </div>

      <!-- Closing -->
      <p style="margin: 24px 0 0 0; color: #334155; font-size: 16px; line-height: 1.6;">
        Enjoy the week off and we'll see you soon!
      </p>

    </div>

    <!-- Footer -->
    <div style="padding: 24px 40px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; line-height: 1.5;">
        Questions before the meeting? Feel free to reach out!
      </p>
      <p style="margin: 0; color: #94a3b8; font-size: 11px;">
        © 2026 Coastal Referral Exchange
      </p>
    </div>

  </div>
</body>
</html>
`

export default presentingTemplate
