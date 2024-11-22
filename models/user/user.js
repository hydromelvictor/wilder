const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
require('dotenv').config();

const Entity = require('../base/entity');


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tstring'
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tstring',
        required: true
    },
    imageUrl: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tstring'
    },
    firstname: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tstring'
    },
    lastname: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tstring'
    },
    birth: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tdate'
    },
    sex: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tstring'
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tstring'
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tstring'
    },
    street: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tstring'
    },
    bio : {
        type: String
    },
    isAuthenticated: {
        type: Boolean,
        default: false
    },
    online: {
        type: Boolean,
        default: false
    },
    state: {
        type: String,
        /**
         * all : profile ouvert a tous
         * fs : friends & followers
         * fd : friends
         * ps : no body
         */
        default: 'all'
    },
    status: {
        type: String,
        /**
         * waiting : status a la creation de compte
         * active : status apres un login
         * inactive : mettre son compte en inactivité
         * delete: status d'un compte supprimer par l'utilisateur
         * suspend: status d'un compte suspendu pour mauvaise conduite
         */
        default: 'waiting'
    },
    staff: {
        type: Boolean,
        default: false,
        immutable: true
    },
    gps: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gps'
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    level: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level',
        required: true
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    blockeds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;  // Supprime le mot de passe du rendu JSON
        return ret;
    }
});

UserSchema.add(Entity)
UserSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', UserSchema)
