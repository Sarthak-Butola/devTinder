// utils/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendNotificationEmail = async (receiverEmail, receiverName, senderName) => {
  try {
    await transporter.sendMail({
      from: `"DevTinder 🔥" <${process.env.EMAIL_USER}>`,
      to: receiverEmail,
      subject: "💌 New Interest Request on DevTinder",
      html: `
        <p>Hi <b>${receiverName}</b>,</p>
        <p><strong>${senderName}</strong> is interested in connecting with you on DevTinder!</p>
        <p><a href="https://dev-tinder-web-f5fb.vercel.app">Check it out now</a></p>
        <br />
        <p>— Team DevTinder</p>
      `,
    });

    console.log(`📨 Email sent to ${receiverEmail}`);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }
};

module.exports = { sendNotificationEmail };
