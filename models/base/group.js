const mongoose = require('mongoose');


const GroupSchema = mongoose.Schema({
    // nom du groupe
    name: {
        type: String,
        required: true,
        unique: true
    },
    // les authorizations du groupe
    auths: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    }]
}, { timestamps: true })


module.exports = mongoose.model('Group', GroupSchema)
