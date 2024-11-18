const mongoose = require('mongoose');
const Entity = require('./entity');

const LevelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    size: {
        type: Number,
        required: true,
    },
    auths: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    }]
})

LevelSchema.add(Entity)

module.exports = mongoose.model('Level', LevelSchema)
