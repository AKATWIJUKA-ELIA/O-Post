export type NewsletterTemplateOptions = {
  siteName?: string;
  logoUrl?: string;
  unsubscribeUrl?: string;
  preheader?: string;
};

export const NewsletterEmail = (
  subject: string,
  body: string,
  options: NewsletterTemplateOptions = {}
) => {
  const {
    siteName = "O-Post",
    logoUrl = "https://expert-goldfish-40.convex.cloud/api/storage/01ad3265-711a-45ef-8c61-5c92a3d8cb9c",
    unsubscribeUrl = "#",
    preheader = subject,
  } = options;

  const safeBody = (body || "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${siteName} • ${subject}</title>
  <style>
    html, body { margin:0 !important; padding:0 !important; height:100% !important; width:100% !important; }
    * { -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt !important; mso-table-rspace:0pt !important; }
    img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; display:block; }
    a { text-decoration:none; }

    .wrapper { width:100%; background:#F5F7FB; }
    .outer { width:100%; max-width:640px; margin:0 auto; background:#ffffff; }

    .header { padding:20px 24px; background:#0B1220; }
    .content { padding:24px; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0B1220; }
    .title { font-size:22px; line-height:1.3; margin:0 0 12px; color:#0B1220; }
    .body { font-size:16px; line-height:1.6; color:#334155; }

    .footer { padding:20px 24px; background:#F8FAFC; color:#64748B; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-size:12px; text-align:center; }
    .footer a { color:#64748B; text-decoration:underline; }

    @media (max-width: 600px) { .content { padding:18px !important; } }
  </style>
</head>
<body style="background:#F5F7FB;">
  <div style="display:none; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all; visibility:hidden;">${preheader}</div>
  <center class="wrapper">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="outer">
            <tr>
              <td class="header">
                <img src="${logoUrl}" width="120" height="32" alt="${siteName} logo" />
              </td>
            </tr>
            <tr>
              <td class="content">
                <h1 class="title">${subject}</h1>
                <div class="body">${safeBody}</div>
              </td>
            </tr>
            <tr>
              <td class="footer">
                <p style="margin:0 0 6px">&copy; ${year} ${siteName}. All rights reserved.</p>
                <p style="margin:0">No longer want these emails? <a href="${unsubscribeUrl}" target="_blank">Unsubscribe</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
};

export default NewsletterEmail;
