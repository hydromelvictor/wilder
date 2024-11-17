const mongoose = require('mongoose');

const EntitySchema = mongoose.Schema({
    // date de mise en status = delete
    deletedAt: {
        type: Date
    },
    // derniere date de mise en status = suspend
    suspendedAt: { 
        type: Date
    },
    // date de derniere online : true
    onlinedAt: { 
        type: Date
    },
    // derniere date de mis en status = inactive
    inactivedAt: { 
        type: Date
    },
    // derniere date d'action a haut risque (pour les admin)
    perfomedAt: { 
        type: Date
    },
}, { timestamps: true });

// Méthode pour mettre à jour la date de modification à chaque sauvegarde
EntitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = EntitySchema
