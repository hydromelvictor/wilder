const mongoose = require('mongoose');


const TypingSchemaString = mongoose.Schema({
    attrs: {
        type: String,
        required: true
    },
    value: {
        type: String
    },
    isPublic: {
        type: Boolean,
        default: true
    }
})


const TypingSchemaDate = mongoose.Schema({
    attrs: {
        type: String,
        required: true
    },
    value: {
        type: Date
    },
    isPublic: {
        type: Boolean,
        default: true
    }
})


module.exports = {
    string: mongoose.model('Tstring', TypingSchemaString),
    date : mongoose.model('Tdate', TypingSchemaDate)
}
