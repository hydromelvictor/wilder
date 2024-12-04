const Group = require('../../models/base/group');
const Auth = require('../../models/base/auth');
const logger = require('../../logger');
const action = require('../../utils/action');

const { 
    verifyAuth, 
    queryCheckAuth,
    queryCheckCreatedAt,
    queryCheckUpdateAuth
} = require('../../utils/other');

const models = require('../../launch').models;
const createLog = require('../../utils/secure').createLog


// creer un nouveau group
exports.createGroup = (req, res, next) => {
    /**
     * name : String
     */

    const { user } = req.auth;

    if (!user) {
        return res.status(401).json({
            msg: 'Unauthorized access',
        });
    }

    const actioner = action(user, Group.modelName);

    if (!user.staff || !actioner.group.isWrite) {
        return res.status(401).json({
            msg: 'Unauthorized access',
        });
    }

    const { name } = req.body;

    // verifions qu'aucun group du meme nom exists 
    Group
        .findOne({ name: name })
        .then(group => {
            if (group) {
                return res.status(400).json({
                    msg: 'this group already exists !!!'
                })
            }

            const auths = models.map(model => ({
                entity: model,
                access: 'rwx'
            }));
        
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
                        .then((group) => {
                            createLog('create group', Auth.modelName, group._id, user)

                            return res.status(201).json({ 
                                values: group._id,
                                msg: 'successfully' 
                            })
                        })
                        .catch(err => {
                            logger.error(err);

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

    const { user } = req.auth;

    if (!user) {
        return res.status(401).json({
            msg: 'Unauthorized access',
        });
    }

    const actioner = action(user, Group.modelName);

    if (!user.staff || !actioner.group.isWrite) {
        return res.status(401).json({
            msg: 'Unauthorized access',
        });
    }

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

    const { user } = req.auth;
    //?page=1&limit=10
    const { page = 1, limit = 10 } = req.query
    const { id } = req.params;

    const offset = (page - 1) * limit;

    if (!user) {
        return res.status(401).json({
            msg: 'Unauthorized access',
        });
    }

    const actioner = action(user, Group.modelName);

    if (!user.staff || !actioner.group.isRead) {
        return res.status(401).json({
            msg: 'Unauthorized access',
        });
    }
    
    Group
        .find( id ? { _id: id } : {})
        .populate('auths')
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .then(groups => {
            if (!groups) {
                return res.status(404).json({
                    msg: 'not found group',
                });
            }

            const totalItems = this.countGroup(req, res, next).store
            const hasPrevPage = page > 1
            const hasNextPage = (offset + limit) < totalItems

            res.status(200).json({
                store: id ? groups[0] : groups,
                pagination: id ? {} : {
                    totalItems: totalItems,
                    limit: limit,
                    page: page,
                    totalPages: Math.ceil(totalItems / limit),
                    pagingCounter: offset + 1,
                    hasPrevPage: hasPrevPage,
                    hasNextPage: hasNextPage,
                    prevPage: hasPrevPage ? page - 1 : null,
                    nextPage: hasNextPage ? page + 1 : null
                },
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

    const { user } = req.auth;

    if (!user) {
        return res.status(401).json({
            msg: 'Unauthorized access',
        });
    }

    const actioner = action(user, Group.modelName);

    if (!user.staff || !actioner.group.isExec
    ) {
        return res.status(401).json({
            msg: 'Unauthorized access',
        });
    }
    
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

    const { user } = req.auth;

    if (!user) {
        return res.status(401).json({
            msg: 'Unauthorized access',
        });
    }

    const actioner = action(user, Group.modelName);

    if (!user.staff|| !actioner.group.isRead) {
        return res.status(401).json({
            msg: 'Unauthorized access',
        });
    }

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
