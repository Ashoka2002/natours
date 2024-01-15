const { convert } = require("html-to-text");
const nodemailer = require("nodemailer");
const Transport = require("nodemailer-brevo-transport");
const pug = require("pug");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Ashok choudhary <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // SENDGRID
      return nodemailer.createTransport(new Transport({ apiKey: process.env.EMAIL_BREVO_API_KEY }));
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // SENDING ACTUAL EMAIL
  async send(template, subject) {
    // 1) RENDERING HTML BASED ON PUG TEMPLATE
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) DEFINING EMAIL OPTION
    const mailOption = {
      from: "Ashok Choudhary <ashokchoudhary@email.com>",
      to: this.to,
      subject,
      html,
      text: convert(html, { wordwrap: false })
    };

    // 3) CREAT TRANSPORT OR SENDING EMAIL
    await this.newTransport().sendMail(mailOption);
  }

  //SENDING WELCOME EMAIL
  async sendWelcome() {
    await this.send("welcome", "Welcome to the natours family");
  }

  async sendPasswordResetEmail() {
    await this.send("passwordReset", "Your password reset Token(valid for 10 minute)");
  }
};

// async function sendEmail(options) {
//   //CRETING TRANSPORTER
//   const transport = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });

//   //DEFINE THE EMAIL OPTION
//   const mailOption = {
//     from: "Ashok Choudhary <ashokchoudhary@email.com>",
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//   };

//SEND THE EMAIL

//   await transport.sendMail(mailOption);
// }

// module.exports = sendEmail;
