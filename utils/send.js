const logger = require('../logger')

const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,  // Serveur SMTP d'Outlook par exemple
    port: process.env.EMAIL_PORT,                 // Port SMTP (souvent 587 pour TLS)
    secure: false,             // true pour le port 465, false pour les autres ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});


function send(to, subject, text = '', html = '') {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    transporter.sendMail(mailOptions)
    .then(info => {
        return true;  // retourne true si l'email a été envoyé avec succès
    })
    .catch(err => {
        logger.error('Erreur lors de l’envoi de l’email :', err);
        return err;   // retourne l'erreur s'il y a un problème
    });
}

module.exports = send
