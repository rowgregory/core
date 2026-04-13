export const bgclTemplate = (memberName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Casino Night Cash Madness - Boys & Girls Club of Lynn</title>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a;">
  <div style="max-width: 520px; margin: 0 auto;">

    <!-- Header -->
    <div style="background: #000000; border: 1px solid #2a2a2a; border-bottom: none; padding: 36px 32px 28px; text-align: center;">
      <p style="margin: 0 0 8px 0; color: #d97706; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3em; font-family: 'Courier New', monospace;">
        Boys &amp; Girls Club of Lynn
      </p>
      <h1 style="margin: 0 0 4px 0; color: #ffffff; font-size: 30px; font-weight: 900; letter-spacing: -0.02em; line-height: 1.1;">
        Casino Night
      </h1>
      <h2 style="margin: 0 0 16px 0; color: #fbbf24; font-size: 22px; font-weight: 900; letter-spacing: 0.05em;">
        CASH MADNESS
      </h2>
      <!-- Gold divider -->
      <div style="height: 2px; background: linear-gradient(90deg, transparent, #d97706, #fbbf24, #d97706, transparent); margin: 0 auto; max-width: 200px;"></div>
    </div>

    <!-- Gold stripe -->
    <div style="height: 4px; background: linear-gradient(90deg, #92400e, #d97706, #fbbf24, #d97706, #92400e);"></div>

    <!-- Body -->
    <div style="background: #111111; padding: 32px; border-left: 1px solid #2a2a2a; border-right: 1px solid #2a2a2a;">

      <p style="margin: 0 0 6px 0; color: #6b7280; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; font-family: 'Courier New', monospace;">
        Hello
      </p>
      <p style="margin: 0 0 24px 0; color: #ffffff; font-size: 20px; font-weight: 800;">
        ${memberName},
      </p>

      <p style="margin: 0 0 28px 0; color: #9ca3af; font-size: 14px; line-height: 1.8;">
        The chips are down and the stakes are high — join us for the <strong style="color: #fbbf24;">Boys &amp; Girls Club of Lynn's biggest night of the year</strong>. An evening of casino-style games, prizes, and a whole lot of fun for an incredible cause.
      </p>

      <!-- Event details card -->
      <div style="margin-bottom: 28px; padding: 20px 24px; background: #1a1a1a; border: 1px solid #2a2a2a; border-left: 3px solid #d97706;">
        <p style="margin: 0 0 4px 0; color: #d97706; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; font-family: 'Courier New', monospace;">
          Event Details
        </p>
        <p style="margin: 0 0 16px 0; color: #ffffff; font-size: 16px; font-weight: 800;">
          Casino Night Cash Madness
        </p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0; color: #9ca3af; font-size: 13px; vertical-align: top; width: 20px;">
              <span style="color: #d97706;">♠</span>
            </td>
            <td style="padding: 4px 0 4px 8px; color: #d1d5db; font-size: 13px;">
              Tedesco Country Club · 154 Tedesco St, Marblehead, MA 01945
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #9ca3af; font-size: 13px; vertical-align: top; width: 20px;">
              <span style="color: #d97706;">♦</span>
            </td>
            <td style="padding: 4px 0 4px 8px; color: #d1d5db; font-size: 13px;">
              Casino attire encouraged — dress the part
            </td>
          </tr>
        </table>
      </div>


      <!-- CTA -->
      <p style="margin: 0 0 20px 0; color: #9ca3af; font-size: 13px; line-height: 1.7; text-align: center;">
        Tickets are on sale now — don't wait until they're gone.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <a href="https://www.bgcl.org/events/cmndt9jok00001iaq8wte1a2z"
               style="display: inline-block; background: linear-gradient(135deg, #d97706, #fbbf24); color: #000000; text-decoration: none; padding: 16px 40px; font-size: 15px; font-weight: 900; letter-spacing: 0.05em; text-transform: uppercase;">
              Get Your Tickets →
            </a>
          </td>
        </tr>
      </table>

    </div>

    <!-- Gold stripe -->
    <div style="height: 4px; background: linear-gradient(90deg, #92400e, #d97706, #fbbf24, #d97706, #92400e);"></div>

    <!-- Footer -->
    <div style="background: #0a0a0a; border: 1px solid #2a2a2a; border-top: none; padding: 20px 32px; text-align: center;">
      <p style="margin: 0 0 6px 0; color: #4b5563; font-size: 12px; line-height: 1.6;">
        Questions?
        <a href="mailto:info@bgcl.org" style="color: #d97706; text-decoration: none; font-weight: 600;">info@bgcl.org</a>
        &nbsp;·&nbsp;
        <a href="tel:781-593-1772" style="color: #d97706; text-decoration: none; font-weight: 600;">(781) 593-1772</a>
      </p>
      <p style="margin: 0; color: #374151; font-size: 11px; font-family: 'Courier New', monospace; letter-spacing: 0.05em;">
        Boys &amp; Girls Club of Lynn &nbsp;·&nbsp; 25 North Common Street, Lynn MA 01902
      </p>
      <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 11px; font-family: 'Courier New', monospace;">
        © ${new Date().getFullYear()} Boys &amp; Girls Club of Lynn
      </p>
    </div>

  </div>
</body>
</html>
`
