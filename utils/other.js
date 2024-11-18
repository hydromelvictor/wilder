const crypto = require('crypto');

function keygen(length) {
    return crypto.randomBytes(length)
        .toString('hex') // Convertit en hexadécimal
        .slice(0, length) // Prend seulement les premiers 'length' caractères
        .toUpperCase(); // Convertit en majuscules (facultatif)
}

const verifyAuth = (auths) => {
    return auths.every(
        auth =>
            typeof auth.access === 'string' &&
            /^[rwxvcud]*$/.test(auth.access) &&
            typeof auth.entity === 'string'
    );
}

const queryCheckCreatedAt = (query, createdAt) => {
    if (createdAt) {
        query.createdAt = {}
        if (createdAt.min) {
            query.createdAt.$gte = new Date(createdAt.min)
        }
        if (createdAt.max) {
            query.createdAt.$lte = new Date(createdAt.max)
        }
    }
    return query;
}

const queryCheckAuth = (query, auth) => {
    if (auth) {
        query.auths = {
            $elemMatch: {}
        }
        if (auth.access) {
            query.auths.$elemMatch.access = auth.access
        }
        if (auth.entity) {
            query.auths.$elemMatch.entity = auth.entity
        }
    }
    return query;
}

const queryCheckUpdateAuth = (model, auths) => {
    for (const auth of auths) {
        if (auth.id && !model.auths.includes(auth.id)) {
            return {
                msg: 'Invalid authorization ID',
            };
        }

        if (!auth.id &&
            model.auths.some(
                (auth) => auth.entity === auth.entity
            ) && model.auths.some(
                (auth) => auth.access === auth.access
            )
        ) {
            return { msg: 'Duplicate authorization'};
        }
    }
    return null;
}

module.exports = {
    keygen,
    verifyAuth,
    queryCheckCreatedAt,
    queryCheckAuth,
    queryCheckUpdateAuth
};



