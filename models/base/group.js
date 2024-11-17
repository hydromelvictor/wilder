const mongoose = require('mongoose');
const Entity = require('./entity');


const GroupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    auths: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    }]
})

GroupSchema.add(Entity)

module.exports = mongoose.model('Group', GroupSchema)
