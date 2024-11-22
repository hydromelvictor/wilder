const mongoose = require('mongoose');
const Entity = require('./entity');

const LevelSchema = mongoose.Schema({
    // nom du niveau d'accès
    name: {
        type: String,
        required: true,
        unique: true
    },
    // taille du niveau d'accès
    size: {
        type: Number,
        required: true,
    },
    // authorizations du niveau d'accès
    auths: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    }]
})

LevelSchema.add(Entity)

module.exports = mongoose.model('Level', LevelSchema)
