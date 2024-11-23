const mongoose = require('mongoose');


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
    // entité
    entity: {
        type: String,
        required: true,
        immutable: true
    }
})

module.exports = mongoose.model('Auth', AuthSchema)
