const mongoose = require('mongoose');
const Entity = require('./entity');


const AuthSchema = mongoose.Schema({
    /**
     * read (r)
     * write (w)
     * execute (x)
     */

    /**
     * execute (x)
     * view (v)
     * create (c)
     * read (r)
     * update (u)
     * delete (d)
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

AuthSchema.add(Entity)

module.exports = mongoose.model('Auth', AuthSchema)
