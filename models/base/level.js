const mongoose = require('mongoose');
const Entity = require('./entity');

const LevelSchema = mongoose.Schema({
    model: {
        type: String,
        default: 'Level'
    },
    performs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        required: true
    }]
})

LevelSchema.plugin(Entity)

module.exports = mongoose.model('Level', LevelSchema)
