// logger.js
const { createLogger, transports, format } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info', // Niveau minimum de log ('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // new transports.Console(), // Affiche les logs dans la console
    new transports.File({ filename: path.join(__dirname, 'logs', 'app.log') }) // Sauvegarde les logs dans un fichier
  ],
});

module.exports = logger;
