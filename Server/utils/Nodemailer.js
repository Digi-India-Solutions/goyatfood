const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dryfruit2664@gmail.com', // Replace with your email
        pass: 'fvvj fqes ixjn kder',    // Replace with App Password
    }, // Output detailed logs
});

module.exports = { transporter };
