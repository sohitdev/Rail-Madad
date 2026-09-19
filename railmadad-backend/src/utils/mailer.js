const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(to, subject, htmlContent) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured. Skipping email to:', to);
    return false;
  }
  try {
    await transporter.sendMail({
      from: `"RailMadad Portal" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

async function sendOTP(email, otp) {
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>RailMadad Verification</h2>
      <p>Your One-Time Password (OTP) for filing a complaint/feedback is:</p>
      <h1 style="color: #047857; letter-spacing: 5px;">${otp}</h1>
      <p>Please do not share this code with anyone.</p>
    </div>
  `;
  return sendEmail(email, 'Your RailMadad OTP', html);
}

async function sendStatusUpdate(email, complaintId, status, remark) {
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Complaint Status Updated</h2>
      <p>Your complaint (ID: <strong>#${complaintId}</strong>) has been updated.</p>
      <p>New Status: <strong>${status}</strong></p>
      ${remark ? `<p>Admin Remark: <em>${remark}</em></p>` : ''}
      <p>Thank you for using RailMadad.</p>
    </div>
  `;
  return sendEmail(email, `Complaint #${complaintId} Update - ${status}`, html);
}

module.exports = {
  sendOTP,
  sendStatusUpdate
};
