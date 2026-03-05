import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (process.env.DEV_MODE === 'true') {
    return null; // Dev mode doesn't need transporter
  }
  
  if (!transporter) {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      throw new Error('SMTP_USER and SMTP_PASS are required when DEV_MODE is false');
    }

    // Determine if secure connection is needed
    const isSecure = port === 465;

    console.log(`[EMAIL SERVICE] Configuring SMTP transporter:`);
    console.log(`  Host: ${host}`);
    console.log(`  Port: ${port}`);
    console.log(`  Secure: ${isSecure}`);
    console.log(`  User: ${user}`);

    transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: isSecure,
      auth: {
        user: user,
        pass: pass, // App password for Gmail or regular password for other providers
      },
    });
  }
  return transporter;
}

async function sendOtpEmail(to, otp) {
  const from = process.env.FROM_EMAIL || 'noreply@realestate.local';
  const subject = 'Your OTP for registration';
  const text = `Your OTP code is: ${otp}. It will expire in 10 minutes.`;

  if (process.env.DEV_MODE === 'true') {
    // Development: log OTP to console instead of sending email
    console.log('\n================ OTP EMAIL (DEV MODE) ================');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${text}`);
    console.log('=======================================================\n');
    return { dev: true, message: 'OTP logged to console' };
  }

  try {
    console.log(`[EMAIL SERVICE] Sending OTP to ${to}...`);
    const emailTransporter = getTransporter();
    const info = await emailTransporter.sendMail({ from, to, subject, text });
    console.log('[EMAIL SERVICE] OTP email sent successfully:', info.messageId || info.response);
    return info;
  } catch (err) {
    console.error('[EMAIL SERVICE] Failed to send OTP email:', err.message);
    throw new Error(`Email delivery failed: ${err.message}`);
  }
}

export default { sendOtpEmail };
