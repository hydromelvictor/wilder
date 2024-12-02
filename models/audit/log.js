const mongoose = require('mongoose');

const LogSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        reef: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    ipAdrress: {
        type: String,
        required: true
    },
    device: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    /**
     * name
     * id
     */
    ressource: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Log', LogSchema)
