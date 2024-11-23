const PhoneNumber = require('awesome-phonenumber');
const countries = require('i18n-iso-countries');
countries.registerLocale(require('i18n-iso-countries/langs/en.json')); 
require('dotenv').config();


function isValidPhoneNumber(phone) {
    const pn = new PhoneNumber(phone);
    return pn.isValid();
}

function getInternationalPhoneNumber(phone) {
    const pn = new PhoneNumber(phone);
    return isValidPhoneNumber(phone) ? pn.getNumber('international'): null;
}

function getCountryName(phone) {
    const pn = new PhoneNumber(phone);
    return isValidPhoneNumber(phone) ? countries.getName(pn.getRegionCode(), 'en') : null;
}


module.exports = {
    isValidPhoneNumber,
    getInternationalPhoneNumber,
    getCountryName
}
