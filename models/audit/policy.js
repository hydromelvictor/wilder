const mongoose = require('mongoose');

const PolicySchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String
    },
    signed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Policy', PolicySchema)
