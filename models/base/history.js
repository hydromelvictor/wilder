const mongoose = require('mongoose');
const Entity = require('./entity');


const HistorySchema = mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: true
    },
    motif: {
        type: String
    }
})

HistorySchema.plugin(Entity)

module.exports = mongoose.model('History', HistorySchema)
