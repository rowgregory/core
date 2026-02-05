export const bgclTemplate = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Donation Reminder - Boys and Girls Club of Lynn</title>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">
    
    <!-- Header -->
    <div style="padding: 32px 40px; border-bottom: 1px solid #e2e8f0;">
      <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Weekly Reminder</p>
      <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 600;">Support Our Youth</h1>
    </div>

    <!-- Main Content -->
    <div style="padding: 32px 40px;">
      
      <!-- Greeting -->
      <p style="margin: 0 0 24px 0; color: #334155; font-size: 16px; line-height: 1.6;">
        Hello CORE Members,
      </p>
      
      <p style="margin: 0 0 24px 0; color: #334155; font-size: 16px; line-height: 1.6;">
        This is your <strong style="color: #0f172a;">weekly reminder</strong> to donate to the <strong style="color: #0f172a;">Boys and Girls Club of Lynn</strong>.
      </p>

      <!-- Highlight Box -->
      <div style="margin: 28px 0; padding: 24px; background: linear-gradient(135deg, #00a4f2 0%, #4a8bb3 100%); border-radius: 12px;">
        <div style="text-align: center;">
          <p style="margin: 0 0 8px 0; color: white; font-size: 22px; font-weight: 700;">
            Making a Difference
          </p>
          <p style="margin: 0; color: rgba(255,255,255,0.95); font-size: 15px; line-height: 1.7;">
            Your contribution helps provide a safe space, mentorship, educational programs, and life changing opportunities for young people in our Lynn community.
          </p>
        </div>
      </div>

      <!-- Impact Section -->
      <div style="margin: 28px 0;">
        <p style="margin: 0 0 16px 0; color: #0f172a; font-size: 15px; font-weight: 600;">
          Your donations support:
        </p>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; width: 24px;">
              <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; margin-top: 4px;"></div>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
              <strong style="color: #0f172a; font-size: 14px;">After School Programs</strong>
              <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;">Keeping kids engaged and learning in a safe environment</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; width: 24px;">
              <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-top: 4px;"></div>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
              <strong style="color: #0f172a; font-size: 14px;">Educational Resources</strong>
              <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;">Tutoring, homework help, and STEM activities</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; width: 24px;">
              <div style="width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; margin-top: 4px;"></div>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
              <strong style="color: #0f172a; font-size: 14px;">Sports & Recreation</strong>
              <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;">Building teamwork, fitness, and confidence</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; vertical-align: top; width: 24px;">
              <div style="width: 8px; height: 8px; background: #8b5cf6; border-radius: 50%; margin-top: 4px;"></div>
            </td>
            <td style="padding: 12px 0;">
              <strong style="color: #0f172a; font-size: 14px;">Mentorship & Leadership</strong>
              <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;">Developing tomorrow's leaders through positive role models</p>
            </td>
          </tr>
        </table>
      </div>

      <!-- CTA Section -->
      <div style="margin: 32px 0; padding: 20px; background: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 8px;">
        <p style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 600;">
          Every dollar counts
        </p>
        <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
          Whether it's $5 or $500, your contribution makes a real impact in the lives of Lynn's youth. Together, we're building a stronger community.
        </p>
      </div>

      <!-- Closing -->
      <p style="margin: 24px 0 0 0; color: #334155; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 12px">
        Thank you for your continued support and generosity!
      </p>
       <div style="text-align: center;">
        <a href="https://bgcl.org/donate" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%); color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
         Donate Now
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 24px 40px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; line-height: 1.5;">
        Questions about donating? Reach out anytime!
      </p>
      <p style="margin: 0; color: #94a3b8; font-size: 11px;">
        © 2026 Coastal Referral Exchange • Supporting Boys and Girls Club of Lynn
      </p>
    </div>

  </div>
</body>
</html>
`
