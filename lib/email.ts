import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendOtpEmail(
  to: string,
  code: string,
  purpose: "register" | "password_reset"
): Promise<{ sent: boolean; devMode?: boolean }> {
  const subject =
    purpose === "register"
      ? "MediSetu — Verify your email"
      : "MediSetu — Password reset code";

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #0d9488;">MediSetu</h2>
      <p>Your verification code is:</p>
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #14b8a6;">${code}</p>
      <p style="color: #64748b; font-size: 14px;">This code expires in 10 minutes. Do not share it with anyone.</p>
    </div>
  `;

  const transporter = getTransporter();

  if (!transporter) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[MediSetu OTP — ${purpose}] ${to}: ${code}`);
      return { sent: true, devMode: true };
    }
    throw new Error(
      "Email service not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local"
    );
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to,
    subject,
    html,
    text: `Your MediSetu code is ${code}. It expires in 10 minutes.`,
  });

  return { sent: true };
}
