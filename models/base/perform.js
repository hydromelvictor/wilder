const mongoose = require('mongoose');
const Entity = require('./entity');

const PerformSchema = mongoose.Schema({
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
    model: {
        type: String,
        default: 'Permission'
    },
    entity: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

PerformSchema.plugin(Entity)

module.exports = mongoose.model('Perform', PerformSchema)
