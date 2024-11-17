const mongoose = require('mongoose');
const Entity = require('../../models/base/entity')
const uniqueValidator = require('mongoose-unique-validator');
require('dotenv').config();


const SecureSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    }
})

SecureSchema.add(Entity)

SecureSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Secure', SecureSchema)
