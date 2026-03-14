import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOtp = async (otp: string, email: string) => {
  try {
    await transporter.sendMail({
      from: '"ExpenseTracker" <no-reply@expensetracker.com>',
      to: email,
      subject: "Your OTP for ExpenseTracker",
      text: `Your OTP for ExpenseTracker is ${otp}. It will expire in 10 minutes.`,
      html: `
      <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:40px;">
        <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:8px;">
          
          <h2 style="margin-top:0; color:#333;">ExpenseTracker</h2>
          
          <p style="color:#555; font-size:15px;">
            Use the following One Time Password (OTP) to complete your login.
          </p>

          <div style="text-align:center; margin:30px 0;">
            <span style="font-size:28px; font-weight:bold; letter-spacing:6px; color:#2d7ff9;">
              ${otp}
            </span>
          </div>

          <p style="color:#777; font-size:14px;">
            This OTP will expire in <b>10 minutes</b>.
          </p>

          <p style="color:#777; font-size:14px;">
            If you didn’t request this, you can safely ignore this email.
          </p>

          <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

          <p style="font-size:12px; color:#aaa;">
            ExpenseTracker • Secure Authentication
          </p>

        </div>
      </div>
    `,
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
