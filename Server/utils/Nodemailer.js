const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dryfruit9006@gmail.com', // Replace with your email
        pass: 'jvck kjxr wesz pfrf',    // Replace with App Password
    }, // Output detailed logs
});

module.exports = { transporter };
