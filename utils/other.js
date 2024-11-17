const crypto = require('crypto');

function keygen(length) {
    return crypto.randomBytes(length)
        .toString('hex') // Convertit en hexadécimal
        .slice(0, length) // Prend seulement les premiers 'length' caractères
        .toUpperCase(); // Convertit en majuscules (facultatif)
}

module.exports = {
    keygen
};
