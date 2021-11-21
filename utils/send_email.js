const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1 Create a transporter

    const smtpOptions = {
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
        },
    }

    try {
        const transporter = nodemailer.createTransport(smtpOptions);

        // 2 Define the email options
        const mailOptions =
        {
            to: `${options.name} <${options.email}>`,
            subject: options.subject,
            text: options.message,
        };

        // 3 Actually send the email
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log(err,)
    }
};

module.exports = sendEmail;
