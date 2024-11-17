const EventEmitter = require('events');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Secure = require('./models/user/user');
const logger = require('./logger');

class ServerEvents extends EventEmitter {}
const serverEvents = new ServerEvents();


// secure entity generate

function secure() {
    Secure.exists({})
    .then(exists => {
        if (exists) return ;
        
        const secure = new Secure({
            token: process.env.SUPER_USER_TOKEN
        })
        secure.save()
        .then(() => logger.info('app secure created successfully !!!'))
        .catch(err => logger.error('app secure failed !!!'))
    })
}


module.exports = {
    serverEvents,
    secure
}
