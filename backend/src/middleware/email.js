const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

async function sendVerificationEmail(email, token) {
  const url = `${process.env.FRONTEND_URL}/verify?token=${token}`
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      email,
    subject: 'Verify your LifePath AI account',
    html: `
      <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 32px; background: #0e1420; color: #e8e8f0; border-radius: 12px;">
        <h2 style="color: #e8c84a; margin-bottom: 8px;">LifePath AI</h2>
        <p style="color: #a0a8b8; margin-bottom: 24px;">Simulate your decisions before you make them.</p>
        <p style="margin-bottom: 20px;">Click the button below to verify your email address:</p>
        <a href="${url}"
           style="display: inline-block; padding: 12px 28px; background: #e8c84a; color: #0a0a0a;
                  text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 14px;">
          Verify Email →
        </a>
        <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">
          This link expires in 24 hours. If you didn't create an account, ignore this email.
        </p>
      </div>
    `,
  })
}

async function sendPasswordResetEmail(email, token) {
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      email,
    subject: 'Reset your LifePath AI password',
    html: `
      <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 32px; background: #0e1420; color: #e8e8f0; border-radius: 12px;">
        <h2 style="color: #e8c84a;">LifePath AI — Password Reset</h2>
        <p style="margin: 16px 0;">Click below to reset your password. Link expires in 1 hour.</p>
        <a href="${url}"
           style="display: inline-block; padding: 12px 28px; background: #e8c84a; color: #0a0a0a;
                  text-decoration: none; border-radius: 8px; font-weight: 800;">
          Reset Password →
        </a>
        <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">
          If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  })
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail }
