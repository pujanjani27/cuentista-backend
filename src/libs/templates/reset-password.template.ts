import { ResetPasswordTemplateProps } from '../utils/constants/interfaces';

export const resetPasswordTemplate = ({
  otp,
  expiresInMinutes = 10,
  appName = 'Your App',
}: ResetPasswordTemplateProps): string => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:24px;">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="max-width:480px; background:#ffffff; border-radius:8px; padding:24px;"
          >
            <tr>
              <td>
                <h2 style="margin:0 0 16px; color:#333333; text-align:center;">
                  Reset Your Password
                </h2>

                <p style="color:#555555; font-size:14px; line-height:1.5;">
                  We received a request to reset your password. Use the OTP below
                  to continue.
                </p>

                <div
                  style="
                    margin:24px 0;
                    text-align:center;
                    font-size:24px;
                    letter-spacing:6px;
                    font-weight:bold;
                    color:#1a73e8;
                    background-color:#f1f5ff;
                    padding:14px;
                    border-radius:6px;
                  "
                >
                  ${otp}
                </div>

                <p style="color:#555555; font-size:14px;">
                  This OTP is valid for <strong>${expiresInMinutes} minutes</strong>.
                </p>

                <p style="color:#777777; font-size:13px;">
                  Please do not share this code with anyone. Our team will never
                  ask for your OTP.
                </p>

                <hr style="border:none; border-top:1px solid #eeeeee; margin:24px 0;" />

                <p style="color:#999999; font-size:12px;">
                  If you didn’t request this, you can safely ignore this email.
                </p>

                <p style="color:#999999; font-size:12px; text-align:center; margin-top:24px;">
                  © ${new Date().getFullYear()} ${appName}. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
