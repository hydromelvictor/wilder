const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
require('dotenv').config();


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: mongoose.Schema.Types.Mixed,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: mongoose.Schema.Types.Mixed,
        unique: true,
        required: true
    },
    imageUrl: {
        type: mongoose.Schema.Types.Mixed
    },
    firstname: {
        type: mongoose.Schema.Types.Mixed
    },
    lastname: {
        type: mongoose.Schema.Types.Mixed
    },
    birth: {
        type: mongoose.Schema.Types.Mixed
    },
    sex: {
        type: mongoose.Schema.Types.Mixed
    },
    country: {
        type: mongoose.Schema.Types.Mixed
    },
    city: {
        type: mongoose.Schema.Types.Mixed
    },
    street: {
        type: mongoose.Schema.Types.Mixed
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
        /**
         * all : profile ouvert a tous
         * hidden : profile caché a tous
         * protected : profile ouvert a ses amis et followers
         * private : profile ouvert a ses amis seulement
         */
        type: String,
        enum: ['all', 'hidden', 'protected', 'private', 'custom'], // Enum pour restreindre les valeurs possibles
        default: 'all'
    },
    status: {
        /**
         * waiting : status a la creation de compte
         * active : status apres un login
         * inactive : mettre son compte en inactivité
         * delete: status d'un compte supprimer par l'utilisateur
         * suspend: status d'un compte suspendu pour mauvaise conduite
         */
        type: String,
        enum: ['delete', 'suspend', 'inactive', 'active', 'waiting'], // Enum pour restreindre les valeurs possibles
        default: 'waiting',
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
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    requests: [{
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
    }],
    deletedAt: {
        type: Date,
    },
    // Dernière date de mise en statut suspend
    suspendedAt: {
        type: Date,
    },
    // Dernière date de statut online = true
    onlinedAt: {
        type: Date,
    },
    // Dernière date de mise en statut inactive
    inactivedAt: {
        type: Date,
    },
    // Dernière action critique
    criticalAt: {
        type: Date,
    }
}, { timestamps: true })

UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;  // Supprime le mot de passe du rendu JSON
        return ret;
    }
});

UserSchema.plugin(uniqueValidator)


UserSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        if (this.status === 'delete') {
            this.deletedAt = new Date();
        }
        if (this.status === 'suspend') {
            this.suspendedAt = new Date();
        }
        if (this.status === 'inactive') {
            this.inactivedAt = new Date();
        }
    }

    if (this.isModified('online') && this.online === true) {
        this.onlinedAt = new Date();
    }
 
    next();
});

module.exports = mongoose.model('User', UserSchema)
