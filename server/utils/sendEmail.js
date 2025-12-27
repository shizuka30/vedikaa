// server/utils/sendEmail.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    console.log('Attempting to send email with Resend...');
    await resend.emails.send({
      from: `EventConnect <${process.env.EMAIL_FROM}>`,
      to: options.email, // The new user's email
      subject: options.subject,
      html: options.html,
    });
    console.log('Email sent successfully via Resend.');
  } catch (error) {
    console.error('!!! Resend Error !!!', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;