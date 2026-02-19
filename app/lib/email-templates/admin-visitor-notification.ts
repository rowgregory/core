const adminVisitorNotificationTemplate = (
  adminName: string,
  applicantName: string,
  applicantEmail: string,
  reviewUrl: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Visitor Form Submission - Coastal Referral Exchange</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; margin: 0 auto; background: white; border-radius: 12px;">

          <!-- Header -->
          <tr>
            <td style="padding: 24px 20px; border-bottom: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Coastal Referral Exchange</p>
              <h1 style="margin: 0 0 4px 0; color: #0f172a; font-size: 24px; font-weight: 600;">New Crew Member Request</h1>
              <p style="margin: 0; color: #64748b; font-size: 13px;">Admin Notification</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 20px;">

              <!-- Greeting -->
              <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                Hi ${adminName},
              </p>
              <p style="margin: 0 0 24px 0; color: #334155; font-size: 14px; line-height: 1.6;">
                A new visitor has submitted their application and is awaiting your review.
              </p>

              <!-- Applicant Details -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
                <tr>
                  <td style="padding: 14px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0 0 12px 0; color: #0f172a; font-size: 14px; font-weight: 600;">Applicant Information</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="color: #64748b; font-size: 13px; width: 60px;">Name</td>
                              <td style="color: #0f172a; font-size: 13px; font-weight: 500;">${applicantName}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="color: #64748b; font-size: 13px; width: 60px;">Email</td>
                              <td style="color: #0f172a; font-size: 13px; font-weight: 500;">${applicantEmail}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="color: #64748b; font-size: 13px; width: 60px;">Status</td>
                              <td>
                                <span style="display: inline-block; padding: 2px 8px; background: #fffbeb; color: #d97706; font-size: 11px; font-weight: 600; border-radius: 4px; text-transform: uppercase;">Pending Review</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
                <tr>
                  <td style="padding: 14px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #0e7490;">
                    <p style="margin: 0 0 10px 0; color: #0f172a; font-size: 14px; font-weight: 600;">Next Steps</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 4px 0; color: #64748b; font-size: 13px; line-height: 1.5;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="vertical-align: top; padding-right: 8px; color: #0e7490;">&#8227;</td>
                              <td>Review the applicant's business profile</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748b; font-size: 13px; line-height: 1.5;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="vertical-align: top; padding-right: 8px; color: #0e7490;">&#8227;</td>
                              <td>Verify their referral network alignment</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748b; font-size: 13px; line-height: 1.5;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="vertical-align: top; padding-right: 8px; color: #0e7490;">&#8227;</td>
                              <td>Approve or provide feedback for improvements</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Review Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
                <tr>
                  <td style="text-align: center; padding: 4px 0;">
                    <a href="${reviewUrl}" style="display: inline-block; background: #0e7490; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                      Review Application
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback Link -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td style="padding: 14px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 6px 0; color: #334155; font-size: 13px; font-weight: 600;">⚓ Can't click the button? Copy this link:</p>
                    <p style="margin: 0; word-break: break-all; font-family: 'SF Mono', Monaco, monospace; font-size: 12px; color: #0e7490; background: white; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                      ${reviewUrl}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
                <tr>
                  <td style="border-top: 1px solid #e2e8f0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Footer note -->
              <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.6; text-align: center;">
                This is an automated admin notification.<br>
                Please review this application promptly to maintain crew morale.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 20px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; color: #cbd5e1; font-size: 11px;">
                &copy; 2026 Coastal Referral Exchange &bull; Building Business Connections by the Shore
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

export default adminVisitorNotificationTemplate
