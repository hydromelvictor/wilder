require('dotenv').config();


function userWithOutOTP(user) {
    delete user.otp
    return user
}

function JWTokenChoice(user) {
    if (user.role === 'admin' || user.role === 'superuser') return process.env.JWT_STAFF_SECRET;
    else return process.env.JWT_USER_SECRET
}


module.exports = {
    userWithOutOTP,
    JWTokenChoice
}
