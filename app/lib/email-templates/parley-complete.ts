const parleyCompletedTemplate = (
  participantName: string,
  otherParticipantName: string,
  updatedAt: string,
  fullUrl: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Parley Completed - ${otherParticipantName}</title>
  <style type="text/css">
    @media (prefers-color-scheme: dark) {
      .email-bg { background-color: #0f172a !important; }
      .card-bg { background-color: #1e293b !important; }
      .text-dark { color: #f1f5f9 !important; }
      .text-gray { color: #cbd5e1 !important; }
      .text-muted { color: #94a3b8 !important; }
      .border-light { border-color: #334155 !important; }
      .summary-box { background-color: #1e3a4f !important; border-color: #16a34a !important; }
      .success-text { color: #86efac !important; }
      .button-bg { background-color: #0891b2 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;" class="email-bg">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;" class="email-bg">
    <tr>
      <td style="padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px;" class="card-bg">
          <tr>
            <td style="padding: 40px 20px;">
    
              <!-- Header -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 32px;">
                    <h1 style="margin: 0; color: #0f172a; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;" class="text-dark">Parley Completed!</h1>
                    <p style="margin: 12px 0 0 0; color: #475569; font-size: 16px; line-height: 1.5;" class="text-gray">Your meeting with ${otherParticipantName} has been successfully logged.</p>
                  </td>
                </tr>
              </table>

              <!-- Meeting Summary -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
                <tr>
                  <td style="padding: 24px; background: #ffffff; border: 2px solid #16a34a; border-radius: 12px;" class="summary-box">
                    <h3 style="margin: 0 0 16px 0; color: #0f172a; font-size: 18px; font-weight: 600;" class="text-dark">Meeting Summary</h3>
                    
                    <div style="margin-bottom: 12px;">
                      <strong style="color: #334155; font-size: 14px;" class="text-gray">Participants:</strong>
                      <p style="margin: 4px 0 0 0; color: #475569; font-size: 16px; font-weight: 600;" class="text-dark">${participantName} & ${otherParticipantName}</p>
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                      <strong style="color: #334155; font-size: 14px;" class="text-gray">Date Completed:</strong>
                      <p style="margin: 4px 0 0 0; color: #475569; font-size: 15px; line-height: 1.5;" class="text-gray">${updatedAt}</p>
                    </div>
                    
                    <div>
                      <strong style="color: #334155; font-size: 14px;" class="text-gray">Status:</strong>
                      <p style="margin: 4px 0 0 0; color: #16a34a; font-size: 15px; font-weight: 600;" class="success-text">Successfully Completed</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 36px 0;">
                <tr>
                  <td align="center">
                    <a href="${fullUrl}" style="display: inline-block; background-color: #0891b2; color: white; text-decoration: none; padding: 16px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; text-align: center;" class="button-bg">
                      Review Parley
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-top: 32px; border-top: 2px solid #f1f5f9;" class="border-light">
                    <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.4;" class="text-gray">
                      This confirmation was sent through the Coastal Referral Exchange.<br>
                      Your networking activity has been recorded and contributes to your overall score.
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

export default parleyCompletedTemplate
