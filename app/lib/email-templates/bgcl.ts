export const bgclTemplate = (memberName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Donation Reminder - Boys and Girls Club of Lynn</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;" class="email-bg">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;" class="email-bg">
    <tr>
      <td style="padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; margin: 0 auto; background: white; border-radius: 12px;" class="card-bg">
          <tr>
            <td style="padding: 24px 20px; border-bottom: 1px solid #e2e8f0;" class="border-light">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;" class="text-muted">Weekly Reminder</p>
              <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 600;" class="text-dark">Support Our Youth</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 20px;">

              <!-- Greeting -->
              <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;" class="text-gray">
                Hi ${memberName},
              </p>
              
              <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;" class="text-gray">
                This is your <strong style="color: #0f172a;" class="text-dark">weekly reminder</strong> to donate to the <strong style="color: #0f172a;" class="text-dark">Boys and Girls Club of Lynn</strong>.
              </p>

              <!-- Highlight Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
                <tr>
                  <td style="padding: 20px 16px; background-color: #3d80ac; border-radius: 12px; text-align: center;" class="highlight-box">
                    <p style="margin: 0 0 8px 0; color: white; font-size: 20px; font-weight: 700;">
                      Making a Difference
                    </p>
                    <p style="margin: 0; color: rgba(255,255,255,0.95); font-size: 14px; line-height: 1.6;">
                      Your contribution helps provide a safe space, mentorship, educational programs, and life changing opportunities for young people in our Lynn community.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Impact Section -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
                <tr>
                  <td>
                    <p style="margin: 0 0 16px 0; color: #0f172a; font-size: 15px; font-weight: 600;" class="text-dark">
                      Your donations support:
                    </p>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; width: 24px;" class="border-light">
                          <div style="width: 8px; height: 8px; background: #3d80ac; border-radius: 50%; margin-top: 4px;"></div>
                        </td>
                        <td style="padding: 12px 0 12px 12px; border-bottom: 1px solid #f1f5f9;" class="border-light">
                          <strong style="color: #0f172a; font-size: 14px;" class="text-dark">After School Programs</strong>
                          <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;" class="text-gray">Keeping kids engaged and learning in a safe environment</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; width: 24px;" class="border-light">
                          <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-top: 4px;"></div>
                        </td>
                        <td style="padding: 12px 0 12px 12px; border-bottom: 1px solid #f1f5f9;" class="border-light">
                          <strong style="color: #0f172a; font-size: 14px;" class="text-dark">Educational Resources</strong>
                          <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;" class="text-gray">Tutoring, homework help, and STEM activities</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; width: 24px;" class="border-light">
                          <div style="width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; margin-top: 4px;"></div>
                        </td>
                        <td style="padding: 12px 0 12px 12px; border-bottom: 1px solid #f1f5f9;" class="border-light">
                          <strong style="color: #0f172a; font-size: 14px;" class="text-dark">Sports & Recreation</strong>
                          <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;" class="text-gray">Building teamwork, fitness, and confidence</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; vertical-align: top; width: 24px;">
                          <div style="width: 8px; height: 8px; background: #8b5cf6; border-radius: 50%; margin-top: 4px;"></div>
                        </td>
                        <td style="padding: 12px 0 12px 12px;">
                          <strong style="color: #0f172a; font-size: 14px;" class="text-dark">Mentorship & Leadership</strong>
                          <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;" class="text-gray">Developing tomorrow's leaders through positive role models</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Section -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
                <tr>
                  <td style="padding: 16px; background: #ffffff; border: 2px solid #3d80ac; border-radius: 8px;" class="cta-box">
                    <p style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 600;" class="text-dark">
                      Every dollar counts
                    </p>
                    <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;" class="text-gray">
                      Whether it's $5 or $500, your contribution makes a real impact in the lives of Lynn's youth. Together, we're building a stronger community.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Closing -->
              <p style="margin: 20px 0 16px 0; color: #334155; font-size: 16px; line-height: 1.6; text-align: center;" class="text-gray">
                Thank you for your continued support and generosity!
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="https://bgcl.org/donate" style="display: inline-block; padding: 14px 28px; background-color: #3d80ac; color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;" class="button-bg">
                     Donate Now
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; background: #ffffff; border-top: 1px solid #e2e8f0;" class="footer-bg border-light">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; line-height: 1.5;" class="text-gray">
                Questions about donating? Contact Sqysh.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px;" class="text-muted">
                © 2026 Coastal Referral Exchange • Supporting Boys and Girls Club of Lynn
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
