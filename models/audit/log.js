const mongoose = require('mongoose');

const LogSchema = mongoose.Schema({
    // celui qui fait l'action a suivre
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        reef: 'User',
        required: true
    },
    // create get delete update
    action: {
        type: String,
        required: true
    },
    // address ip du owner
    ipAdrress: {
        type: String,
        required: true
    },
    // information sur l'appareil de connexion
    device: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    /**
     * name : User(ex)
     * id
     */
    ressource: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Log', LogSchema)
