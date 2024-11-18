/**
 * groups
 * 
 * definition:
 * 
 * les groups standard: user - superuser
 * 
 * il est du devoir et de la seul responsabilité a un
 * superuser de creer de nouveau group comme par exemple
 * admin - controller - direction ...etc
 * 
 * c'est different group on pour objectif de defini
 * plusieur acteur intervenant a des niveau d'acreditation
 * different dans l'application tout en garantissant la
 * securité des données
 */

const Group = require('../../models/base/group')
const Auth = require('../../models/base/auth')
const logger = require('../../logger');
const { 
    verifyAuth, 
    queryCheckAuth,
    queryCheckCreatedAt,
    queryCheckUpdateAuth
} = require('../../utils/other');



// creer un nouveau group
exports.createGroup = (req, res, next) => {
    /**
     * name : String
     * auths : Array
     *  items:
     *      access
     *      auths
     */

    const { name, auths } = req.body;

    // Validation des données
    if (
        !name || !Array.isArray(auths) ||
        !verifyAuth(auths)
    ) {
        return res.status(400).json({
            msg: 'name and authorizations are required or invalid !!!',
        });
    }

    // verifions qu'aucun group du meme nom exists 
    Group
        .findOne({ name: name })
        .then(group => {
            if (group) {
                return res.status(400).json({
                    msg: 'this group already exists !!!'
                })
            }
        
            // creation des authorizations relative au group
            Auth
                .insertMany(auths)
                .then(insertedAuths => {
                    // creation du group
                    const group = new Group({
                        name: name,
                        auths: insertedAuths.map(auth => auth._id)
                    })

                    group
                        .save()
                        .then(() => 
                            res
                                .status(201)
                                .json({ 
                                    values: group._id,
                                    msg: 'successfully' 
                                }
                        ))
                        .catch(err => {
                            logger.error(err)
                            return res.status(500).json({
                                msg: 'error creating group',
                                error: err.message
                            })
                        });
                })
                .catch(err => {
                    logger.error(err)
                    return res.status(500).json({
                        msg: 'error creating auth',
                        error: err.message
                    })
                });
        })
        .catch(err => {
            logger.error(err)
            return res.status(500).json({
                msg: 'error creating group',
                error: err.message
            })
        });
};

// mis a jour d'un group
exports.updateGroup = (req, res, next) => {
    /**
     * params: id
     * name : String
     * auths : Array
     *     { access: 'rwx', id: 'ObjectId'}
     */
    const { name, auths } = req.body;
    const { id } = req.params;
    
    // Validation des données
    if (
        !name || !Array.isArray(auths) ||
        !verifyAuth(auths)
    ) {
        return res.status(400).json({
            msg: 'name and authorizations are required or invalid !!!',
        });
    }

    Group
        .findOne({ _id: id })
        .then((group) => {
            if (!group) {
                return res.status(404).json({
                    msg: 'group not found',
                });
            }

            // Vérification des authorizations
            const error = queryCheckUpdateAuth(group, auths);
            if (error) {
                return res.status(400).json(error);
            }

            // Préparation des opérations en bulk
            const bulkOps = auths.map((auth) => {
                if (auth.id) {
                    // Mise à jour des autorisations existantes
                    return {
                        updateOne: {
                            filter: { _id: auth.id },
                            update: { 
                                $set: { access: auth.access }
                            },
                        },
                    };
                } else {
                    // Insertion des nouvelles autorisations
                    return {
                        insertOne: {
                            document: new Auth({
                                access: auth.access,
                                entity: auth.entity,
                            }),
                        },
                    };
                }
            });

            Auth
                .bulkWrite(bulkOps)
                .then((result) => {
                    // Récupération des nouveaux ou mis à jour `_id`
                    const updatedAuths = auths.map((auth, index) => {
                        return auth.id || result.insertedIds[index];
                    });
                    
                    // Mise à jour du groupe
                    Group
                        .updateOne(
                            { _id: group._id },
                            {
                                name: name,
                                auths: updatedAuths,
                            }
                        )
                        .then(() =>
                            res
                                .status(200)
                                .json({ msg: 'group updated successfully' })
                        )
                        .catch((err) => {
                            logger.error(err);
                            res.status(500).json({
                                msg: 'Error updating group',
                                error: err.message,
                             });
                        });
                })
                .catch((err) => {
                    logger.error(err);
                    res.status(500).json({
                        msg: 'Error updating group',
                        error: err.message,
                     });
                });
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).json({
                msg: 'Error updating group',
                error: err.message,
             });
        });
};

// lire
exports.getGroup = (req, res, next) => {
    /**
     * params: id
     */
    const { id } = req.params;
    Group
        .find( id ? { _id: id } : {})
        .populate('auths')
        .then(groups => {
            if (!groups) {
                return res.status(404).json({
                    msg: 'not found group',
                });
            }
            res.status(200).json({
                values: id ? groups[0] : groups,
                msg: 'successfully',
            });
        })
        .catch(err => {
            logger.error(err);
            return res.status(500).json({
                msg: 'error finding group',
                error: err.message
             })
        });
}

// supprimer
exports.deleteGroup = (req, res, next) => {
    /**
     * params: id
     */
    const { id } = req.params;

    Group
        .find(id ? { _id: id } : {})
        .populate('auths')
        .then(groups => {
            if (!groups) {
                return res.status(404).json({ msg: 'groups not found' });
            }

            // Supprimer les authorizations associées
            const deletedAuths = Array.isArray(groups) ? groups.flatMap(
                group => group.auths.map(
                    (auth) => auth._id
                )) : groups.auths.map(
                    (auth) => auth._id
                );

            Auth
                .deleteMany({ _id: { $in: deletedAuths } })
                .then(() => {
                    // Supprimer les groupes
                    const ids = Array.isArray(groups) ? groups.map(
                        group => group._id) : groups._id;

                    Group
                        .deleteMany({ _id: { $in: ids } })
                        .then(() => res.status(204).send())
                        .catch(err => {
                            logger.error(err);
                            res.status(500).json({ 
                                msg: 'Error deleting group', 
                                error: err.message 
                            });
                        });
                })
                .catch((err) => {
                    logger.error(err);
                    res.status(500).json({ 
                        msg: 'Error deleting auths', 
                        error: err.message 
                    });
                });
        })
        .catch(err => {
            logger.error(err);
            res.status(500).json({ 
                msg: 'Error deleting group', 
                error: err.message 
            });
        });
}

// lire un ensemble de group
exports.getFindGroup = (req, res, next) => {
    /**
     * Rechercher des groupes selon des critères
     * createdAt:
     *   min: Date
     *   max: Date
     * auth:
     *   access: String
     *   entity: String
     */

    const { createdAt, auth } = req.body;

    // check
    const data = queryCheckAuth(
        queryCheckCreatedAt({}, createdAt),
        auth
    );

    Group.find(data)
        .populate('auths')
        .then((groups) => {
            if (!groups.length) {
                return res.status(404).json({ msg: 'No groups found' });
            }
            return res.status(200).json({
                values: groups,
                msg: 'Groups found',
            });
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).json({
                msg: 'Error finding groups',
                error: err.message,
             });
        });
};

// supprimer ensemble de group
exports.deleteFindGroup = (req, res, next) => {
    /**
     * Supprime les groupes en fonction des critères
     * createdAt:
     *   min: Date
     *   max: Date
     * auth:
     *   access: String
     *   entity: String
     */

    const { createdAt, auth } = req.body;

    // check
    const data = queryCheckAuth(
        queryCheckCreatedAt({}, createdAt),
        auth
    );

    Group.find(data)
        .populate('auths')
        .then((groups) => {
            if (!groups.length) {
                return res.status(404).json({ msg: 'No groups found' });
            }

            // Extraire tous les IDs d'authorizations à supprimer
            const authIds = groups.flatMap((group) => group.auths.map((auth) => auth._id));

            // Supprimer les groupes correspondants
            Group.deleteMany({ _id: { $in: groups.map((group) => group._id) } })
                .then(() => {
                    // Supprimer les authorizations associées
                    Auth.deleteMany({ _id: { $in: authIds } })
                        .then(() => res.status(204).send())
                        .catch((err) => {
                            logger.error(err);
                            res.status(500).json({ msg: 'Error deleting auths', error: err.message });
                        });
                })
                .catch((err) => {
                    logger.error(err);
                    res.status(500).json({ msg: 'Error deleting groups', error: err.message });
                });
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).json({ msg: 'Error finding groups', error: err.message });
        });
};

// nombre de group existant
exports.countGroup = (req, res, next) => {
    /**
     * retourne le nombre de group existant
     * createdAt:
     *  min: Date
     *  max: Date
     * auth:
     *  access: String
     *  entity: String
     */

    const { createdAt, auth } = req.body;
    const data = {};

    // check
    data = queryCheckAuth(
        queryCheckCreatedAt(data, createdAt),
        auth
    );

    Group
        .countDocuments(data)
        .then(count => res.status(200).json({
            values: count,
            msg: 'count group'
        }))
        .catch(err => res.status(500).json({
            msg: 'error counting group',
            error: err.message
        }))
}
