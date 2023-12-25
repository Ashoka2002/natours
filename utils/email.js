const nodemailer = require("nodemailer");

async function sendEmail(options) {
  //CRETING TRANSPORTER
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  //DEFINE THE EMAIL OPTION
  const mailOption = {
    from: "Ashok Choudhary <ashokchoudhary@email.com>",
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  //SEND THE EMAIL

  await transport.sendMail(mailOption);
}

module.exports = sendEmail;
