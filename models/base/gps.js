const mongoose = require('mongoose');
const Entity = require('./entity')


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

GpsSchema.plugin(Entity)

mongoose.model('Gps', GpsSchema)
