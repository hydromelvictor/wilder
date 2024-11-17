const mongoose = require('mongoose');
const Entity = require('./entity');


const AuthSchema = mongoose.Schema({
    /**
     * read (r)
     * write (w)
     * execute (x)
     */
    access: {
        type: String,
        default: ''
    },
    entity: {
        type: String,
        required: true,
        immutable: true
    }
})

AuthSchema.add(Entity)

module.exports = mongoose.model('Auth', AuthSchema)
