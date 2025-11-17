import { User } from "@/lib/types"
import { BASE_URL } from "@/lib/urls"
const currentYear = new Date().getFullYear()
export const WelcomeEmail = (user:User,token:string)=>{
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to O-Post</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #F5F7FB;
            font-family: 'Inter', sans-serif;
            color: #1A1A1A;
        }

        table { border-collapse: collapse; }
        a { text-decoration: none; }

        .email-container {
            width: 100%;
            max-width: 640px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }

        .header {
            background-color: #0A66FF;
            padding: 28px;
            text-align: center;
        }

        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 26px;
            font-weight: 600;
        }

        .content {
            padding: 30px 35px;
            font-size: 16px;
            line-height: 1.6;
        }

        .hero-image {
            width: 100%;
            display: block;
        }

        .button {
            display: inline-block;
            background-color: #0A66FF;
            color: #ffffff;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
        }

        .footer {
            background-color: #F2F4F8;
            text-align: center;
            padding: 22px;
            font-size: 13px;
            color: #777;
        }

        .footer a {
            color: #0A66FF;
            text-decoration: underline;
        }

        @media only screen and (max-width: 600px) {
            .email-container { border-radius: 0; }
            .content { padding: 22px; }
            .button {
                width: 100%;
                text-align: center;
                padding: 12px 0;
            }
        }
    </style>
</head>

<body>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table class="email-container">

                    <!-- Header -->
                    <tr>
                        <td class="header">
                            <h1>Welcome to O-Post</h1>
                        </td>
                    </tr>

                    <!-- Hero Banner -->
                    <tr>
                        <td>
                            <img src="https://placehold.co/640x220/0A66FF/FFFFFF?text=Welcome+to+O-Post" class="hero-image" alt="O-Post Banner"/>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td class="content">
                            <p>Hi ${user.username},</p>

                            <p>
                                We're excited to have you join O-Post — your digital mailbox for secure, fast, and reliable messages.  
                                Before you dive in, please verify your email to activate your account.
                            </p>

                            <p style="text-align: center;">
                                <a class="button" href="${BASE_URL}/api/verifyaccount?k9m3p7q2r8t4v1w6x5y9z2a8b4c6d1e7f3g9h2j5k8m4n6p1q7r3t9u2v5w8x4y6z3a9b2c7d1e4f8g6h2j9k5m3=${token}">
                                    Verify Email
                                </a>
                            </p>


                            <p>Welcome aboard,<br> The O-Post Team</p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="footer">
                            <p>&copy; ${currentYear} O-Post. All rights reserved.</p>
                            <p>
                                <a href="#">Privacy Policy</a> • 
                                <a href="#">Terms of Service</a>
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
}