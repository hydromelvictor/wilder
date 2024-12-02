const mongoose = require('mongoose');


const NotifySchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        reef: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['read', 'noRead', 'readAndDelete', 'noReadAndDelete'],
        default: 'noRead'
    },
    level: {
        type: String,
        enum: ['Danger', 'Warning', 'Info', 'Success']
    }
}, { timestamps: true })


module.exports = mongoose.model('Notify', NotifySchema)
