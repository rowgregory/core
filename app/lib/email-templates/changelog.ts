const changelogTemplate = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Platform Update - Coastal Referral Exchange</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; margin: 0 auto; background: white; border-radius: 12px;">

         <!-- GIF -->
          <tr>
            <td style="padding: 0; border-radius: 12px 12px 0 0; overflow: hidden;">
              <img src="https://coastal-referral-exchange.com/images/sqysh_typing.gif" width="520" alt="Sqysh typing" style="width: 100%; max-width: 520px; display: block; margin: 0; border-radius: 12px 12px 0 0;" />
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 24px 20px; border-bottom: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Coastal Referral Exchange</p>
              <h1 style="margin: 0 0 4px 0; color: #0f172a; font-size: 24px; font-weight: 600;">Platform Update</h1>
              <p style="margin: 0; color: #64748b; font-size: 13px;">February 19, 2026</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 20px;">

              <!-- Greeting -->
              <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                Ahoy crew,
              </p>
              <p style="margin: 0 0 24px 0; color: #334155; font-size: 14px; line-height: 1.6;">
                Here's a quick look at what's new on the platform this week.
              </p>

              <!-- Change 1: Navigator Card Permissions -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 16px 0;">
                <tr>
                  <td style="padding: 14px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #6366f1;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 6px;">
                          <span style="display: inline-block; padding: 2px 8px; background: #eef2ff; color: #4f46e5; font-size: 11px; font-weight: 600; border-radius: 4px; text-transform: uppercase;">Improved</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin: 0 0 4px 0; color: #0f172a; font-size: 14px; font-weight: 600;">Navigator Card — Admin-only edit permissions</p>
                          <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5;">Updated the navigator card click handler to restrict editing of member profiles to admins only. Members and other roles are no longer able to trigger the update drawer when clicking a card.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Change 2: Parley Card Color -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 16px 0;">
                <tr>
                  <td style="padding: 14px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #10b981;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 6px;">
                          <span style="display: inline-block; padding: 2px 8px; background: #ecfdf5; color: #059669; font-size: 11px; font-weight: 600; border-radius: 4px; text-transform: uppercase;">Updated</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin: 0 0 4px 0; color: #0f172a; font-size: 14px; font-weight: 600;">Parley Card — Completed status color</p>
                          <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5;">The completed status on parley cards has been updated to Tailwind emerald for a cleaner, more consistent visual indicator across the platform.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Change 3: Calendar Presenter -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 16px 0;">
                <tr>
                  <td style="padding: 14px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #0e7490;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 6px;">
                          <span style="display: inline-block; padding: 2px 8px; background: #ecfeff; color: #0e7490; font-size: 11px; font-weight: 600; border-radius: 4px; text-transform: uppercase;">New</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin: 0 0 4px 0; color: #0f172a; font-size: 14px; font-weight: 600;">Calendar — Presenter visible on event cards</p>
                          <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5;">Event descriptions now appear below the event title directly on calendar day cards, so crew members can see who's presenting at a glance without having to open the event detail.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Change 4: Member Directory -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 16px 0;">
                <tr>
                  <td style="padding: 14px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 6px;">
                          <span style="display: inline-block; padding: 2px 8px; background: #f5f3ff; color: #7c3aed; font-size: 11px; font-weight: 600; border-radius: 4px; text-transform: uppercase;">New</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin: 0 0 4px 0; color: #0f172a; font-size: 14px; font-weight: 600;">Member Dashboard — Member directory added</p>
                          <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5;">Members now have access to a member directory directly from their dashboard, making it easier to find and connect with fellow crew members.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Change 5: Email Templates -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td style="padding: 14px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 6px;">
                          <span style="display: inline-block; padding: 2px 8px; background: #fffbeb; color: #d97706; font-size: 11px; font-weight: 600; border-radius: 4px; text-transform: uppercase;">Updated</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin: 0 0 4px 0; color: #0f172a; font-size: 14px; font-weight: 600;">Email Templates — Dark mode styling removed</p>
                          <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5;">Dark mode overrides have been removed from all email templates to ensure consistent, predictable rendering across all email clients and devices.</p>
                        </td>
                      </tr>
                    </table>
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
                Questions or issues? Contact Sqysh.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 20px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; color: #cbd5e1; font-size: 11px;">
                &copy; 2026 Coastal Referral Exchange &bull; All rights reserved
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

export default changelogTemplate
