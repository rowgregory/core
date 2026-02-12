const swabbieSecondChanceTemplate = (applicantName: string, fullUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Second Chance - Coastal Referral Exchange</title>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0; color: #0f172a; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;">A New Voyage Awaits, ${applicantName}!</h1>
      <p style="margin: 12px 0 0 0; color: #475569; font-size: 16px; line-height: 1.5;">Good news! We're giving your Coastal Referral Exchange application a second chance for consideration.</p>
    </div>

    <!-- Status -->
    <div style="text-align: center; margin: 36px 0;">
      <div style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 16px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.3);">
      Application Reconsidered - Back to Pending
      </div>
    </div>

    <!-- Check Status Button -->
    <div style="text-align: center; margin: 36px 0;">
      <a href="${fullUrl}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; text-decoration: none; padding: 16px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px 0 rgba(14, 165, 233, 0.3); transition: all 0.2s; border: none;">
        🔍 Check Your Application Status
      </a>
    </div>

    <!-- Voyage Progress Section -->
    <div style="margin: 32px 0; padding: 24px; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 12px; border-left: 4px solid #3b82f6;">
      <h3 style="margin: 0 0 16px 0; color: #0f172a; font-size: 16px; font-weight: 600;">Your Fresh Start Voyage:</h3>
      
      <div style="margin-bottom: 12px;">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <div style="width: 16px; height: 16px; background: #10b981; border-radius: 50%; margin-right: 12px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 10px; font-weight: bold;">✓</span>
          </div>
          <span style="color: #374151; font-size: 14px; font-weight: 500;">Original Application Submitted</span>
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <div style="width: 16px; height: 16px; background: #3b82f6; border-radius: 50%; margin-right: 12px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 10px; font-weight: bold;">🔄</span>
          </div>
          <span style="color: #3b82f6; font-size: 14px; font-weight: 600;">Reconsideration Granted - Pending Review</span>
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <div style="width: 16px; height: 16px; background: #d1d5db; border-radius: 50%; margin-right: 12px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #9ca3af; font-size: 10px;">2</span>
          </div>
          <span style="color: #9ca3af; font-size: 14px;">Fresh Review Process</span>
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <div style="width: 16px; height: 16px; background: #d1d5db; border-radius: 50%; margin-right: 12px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #9ca3af; font-size: 10px;">3</span>
          </div>
          <span style="color: #9ca3af; font-size: 14px;">Background Verification</span>
        </div>
        
        <div style="display: flex; align-items: center;">
          <div style="width: 16px; height: 16px; background: #d1d5db; border-radius: 50%; margin-right: 12px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #9ca3af; font-size: 10px;">4</span>
          </div>
          <span style="color: #9ca3af; font-size: 14px;">Final Decision</span>
        </div>
      </div>
    </div>

    <!-- What This Means Section -->
    <div style="margin: 32px 0; padding: 20px; background: #f0fdf4; border-radius: 12px; border-left: 4px solid #22c55e;">
      <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px; font-weight: 600;">What This Means for You:</h3>
      <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.6;">
        <li>Your application is being reviewed with fresh eyes</li>
        <li>Business circumstances and network needs may have changed</li>
        <li>You'll go through the complete evaluation process again</li>
        <li>We'll keep you updated at every step of this new voyage</li>
      </ul>
    </div>

    <!-- Why We're Reconsidering -->
    <div style="margin: 32px 0; padding: 20px; background: #fefce8; border-radius: 12px; border-left: 4px solid #eab308;">
      <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px; font-weight: 600;">Why We're Giving You Another Chance:</h3>
      <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
        Our crew believes in second opportunities. Whether it's changes in our network needs, evolving business landscapes, or simply taking another look with different perspective - we want to ensure we don't miss out on valuable potential crew members like yourself.
      </p>
    </div>

    <!-- Timeline -->
    <div style="margin: 32px 0; padding: 20px; background: #f0f9ff; border-radius: 12px; border-left: 4px solid #0ea5e9;">
      <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px; font-weight: 600;">What Happens Next:</h3>
      <div style="margin-bottom: 12px;">
        <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
          <div style="width: 20px; height: 20px; background: #0ea5e9; color: white; border-radius: 50%; margin-right: 12px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0; margin-top: 2px;">1</div>
          <span style="color: #475569; font-size: 14px; line-height: 1.6;">Fresh initial review of your application and qualifications</span>
        </div>
        <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
          <div style="width: 20px; height: 20px; background: #0ea5e9; color: white; border-radius: 50%; margin-right: 12px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0; margin-top: 2px;">2</div>
          <span style="color: #475569; font-size: 14px; line-height: 1.6;">Updated background verification process</span>
        </div>
        <div style="display: flex; align-items: flex-start;">
          <div style="width: 20px; height: 20px; background: #0ea5e9; color: white; border-radius: 50%; margin-right: 12px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0; margin-top: 2px;">3</div>
          <span style="color: #475569; font-size: 14px; line-height: 1.6;">Final decision based on current network needs and criteria</span>
        </div>
      </div>
    </div>

    <!-- Encouragement -->
    <div style="margin: 24px 0; padding: 18px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
      <p style="margin: 0 0 8px 0; color: #334155; font-size: 14px; font-weight: 600;">⚓ Stay Optimistic:</p>
      <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
        This second chance represents a fresh start. We're committed to giving your application the thorough and fair consideration it deserves. Keep an eye on your inbox for updates as we navigate this new voyage together.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 2px solid #f1f5f9;">
      <div style="margin-bottom: 16px;">
        <svg width="80" height="20" viewBox="0 0 100 25" style="opacity: 0.6;">
          <path d="M5 12.5C5 8.5 8.5 5 12.5 5S20 8.5 20 12.5 16.5 20 12.5 20 5 16.5 5 12.5z" fill="#3b82f6"/>
          <path d="M25 12.5c0-2 1-3.5 2.5-4.5s3.5-1 5.5 0 3.5 2.5 3.5 4.5-1 3.5-2.5 4.5-3.5 1-5.5 0-3.5-2.5-3.5-4.5z" fill="#2563eb"/>
          <path d="M45 12.5c0-4 3.5-7.5 7.5-7.5s7.5 3.5 7.5 7.5-3.5 7.5-7.5 7.5-7.5-3.5-7.5-7.5z" fill="#3b82f6"/>
          <text x="70" y="15" font-family="Arial" font-size="8" fill="#64748b">CRE</text>
        </svg>
      </div>
      <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.4;">
        We believe in second chances and fresh perspectives.<br>
        Questions about this process? Contact us at support@coastalreferralexchange.com
      </p>
      <p style="margin: 16px 0 0 0; color: #94a3b8; font-size: 11px;">
        © 2025 Coastal Referral Exchange • Building Business Connections by the Shore
      </p>
    </div>
  </div>
</body>
</html>
`

export default swabbieSecondChanceTemplate
