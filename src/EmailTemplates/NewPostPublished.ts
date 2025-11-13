import { Post } from "@/lib/types";

const currentYear = new Date().getFullYear();

export type NewPostEmailOptions = {
  siteName?: string;
  postUrl?: string;
  logoUrl?: string;
  preheader?: string;
  unsubscribeUrl?: string;
};

export const NewPostPublishedEmail = (
  post: Post,
  options: NewPostEmailOptions = {}
) => {
  const {
    siteName = "O-Post",
    postUrl = "#",
    logoUrl = "https://expert-goldfish-40.convex.cloud/api/storage/01ad3265-711a-45ef-8c61-5c92a3d8cb9c",
    preheader = `New ${post.category} story: ${post.title}`,
  } = options;

  const safeExcerpt = (post.excerpt || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const imageUrl = post.postImage || "https://placehold.co/1200x600/EEF2FF/1D4ED8?text=" + encodeURIComponent(post.title);

  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${siteName} • ${post.title}</title>

    <style>
      /* Global resets */
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background-color: #f5f7fb;
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #0b1220;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
      }
      img {
        display: block;
        border: none;
        outline: none;
        text-decoration: none;
        max-width: 100%;
      }
      a {
        text-decoration: none;
      }

      /* Layout */
      .wrapper {
        width: 100%;
        background: #f5f7fb;
        padding: 30px 0;
      }

      .outer {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      }

      /* Header */
      .header {
        background: #0b1220;
        padding: 20px 24px;
        text-align: left;
      }
      .header img {
        height: 40px;
      }

      /* Hero Image */
      .hero img {
        width: 100%;
        border-bottom: 1px solid #e2e8f0;
      }

      /* Content */
      .content {
        padding: 28px 24px;
      }
      .kicker {
        color: #2563eb;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 8px;
      }
      .title {
        font-size: 24px;
        line-height: 1.3;
        font-weight: 700;
        margin: 0 0 12px;
      }
      .excerpt {
        color: #475569;
        font-size: 16px;
        line-height: 1.6;
        margin: 0 0 24px;
      }

      /* Button */
      .btn-wrap {
        text-align: center;
        margin: 12px 0 24px;
      }
      .btn {
        display: inline-block;
        background: #1d4ed8;
        color: #ffffff;
        padding: 14px 28px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
      }
      .btn:hover {
        background: #1e40af;
      }

      /* Divider */
      .divider {
        height: 1px;
        background: #e5e7eb;
        margin: 24px 0;
      }

      /* Footer */
      .footer {
        background: #f8fafc;
        padding: 20px;
        text-align: center;
        color: #64748b;
        font-size: 13px;
        border-top: 1px solid #e5e7eb;
      }
      .footer a {
        color: #2563eb;
        text-decoration: underline;
      }

      /* Responsive */
      @media (max-width: 600px) {
        .title { font-size: 20px !important; }
        .excerpt { font-size: 15px !important; }
        .content { padding: 20px !important; }
        .btn { font-size: 15px !important; padding: 12px 22px !important; }
      }
    </style>
  </head>

  <body>
    <div style="display:none; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all;">
      ${preheader}
    </div>

    <center class="wrapper">
      <table role="presentation" width="100%">
        <tr>
          <td align="center">
            <table role="presentation" class="outer">

              <!-- Header -->
              <tr>
                <td class="header">
                  <img src="${logoUrl}" alt="${siteName} logo" />
                </td>
              </tr>

              <!-- Hero Image -->
              <tr>
                <td class="hero">
                  <img src="${imageUrl}" alt="${post.title}" />
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td class="content">
                  <p class="kicker">${post.category}</p>
                  <h1 class="title">${post.title}</h1>
                  <p class="excerpt">${safeExcerpt}</p>

                  <div class="btn-wrap">
                    <a href="${postUrl}" target="_blank" class="btn" rel="noopener noreferrer">Read Full Article</a>
                  </div>

                  <div class="divider"></div>
                  <p style="font-size:14px; color:#475569; text-align:center;">
                    You’re receiving this because you’re subscribed to <strong>${siteName}</strong> updates.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p>&copy; ${currentYear} ${siteName}. All rights reserved.</p>
                  <p>
  
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>

  `;
};

export default NewPostPublishedEmail;
