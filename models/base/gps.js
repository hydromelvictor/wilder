const mongoose = require('mongoose');


const GpsSchema = mongoose.Schema({
    lng: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    model: {
        type: String,
        default: 'Gps'
    },
    entity: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})


module.exports = mongoose.model('Gps', GpsSchema)
