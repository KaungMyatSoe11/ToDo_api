const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig');

const sendEmail = async ({ to, subject, html }) => {

  const transporter = nodemailer.createTransport(nodemailerConfig);
console.log(html,to,subject);
  return transporter.sendMail({
    from: '"Test Mail" <test@kaungmyatsoe.dev>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
