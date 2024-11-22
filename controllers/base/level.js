/**
 * level
 * 
 * definition:
 * 
 * les level standards: critical - hot - normal - basic
 * 
 * il est du devoir et de la seul responsabilité a un
 * superuser de creer de nouveau level
 * 
 * c'est different level on pour objectif de defini
 * des hierachie dans chaque group garantissant ainsi
 * la securité des données
 */

const Level = require('../../models/base/level')
const Auth = require('../../models/base/auth')
const logger = require('../../logger')
const { 
    verifyAuth, 
    queryCheckAuth,
    queryCheckCreatedAt,
    queryCheckUpdateAuth
} = require('../../utils/other');



// creer un nouveau level
exports.createLevel = (req, res, next) => {
    /**
     * name: String
     * size: Number
     * auths:
     *  items:
     *      access
     *      entity
     */

    const { name, size, auths } = req.body

    if (!name || !size || !auths) {
        return res.status(400).json({
            message: 'Bad request'
        })
    }

    if (!verifyAuth(auths)) {
        return res.status(400).json({
            message: 'Bad request'
        })
    }

    Level
        .findOne({ name: name })
        .then(level => {
            if (level) {
                return res.status(409).json({
                    msg: 'Conflict'
                })
            }

            Auth
                .insertMany(auths)
                .then(insertedAuths => {
                    // creer un nouveau level
                    const newLevel = new Level({
                        name: name,
                        size: size,
                        auths: insertedAuths.map(auth => auth._id)
                    })

                    newLevel
                        .save()
                        .then(level => {
                            res.status(201).json({
                                values: level._id,
                                msg: 'Created'
                            })
                        })
                        .catch(err => {
                            logger.error(err)
                            res.status(500).json({
                                msg: 'error server',
                                error: err.message
                            })
                        })
                })
                .catch(err => {
                    logger.error(err)
                    res.status(500).json({
                        msg: 'error server',
                        error: err.message
                    })
                })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({
                msg: 'error server',
                error: err.message
            })
        })
}

// mis a jour d'un level
exports.updateLevel = (req, res, next) => {
    /**
     * name: String
     * size: Number
     * auths:
     * items:
     *  { access, id }
     */

    const { name, size, auths } = req.body
    const { id } = req.params

    if (!name || !size || !auths || !id) {
        return res.status(400).json({
            msg: 'Bad request'
        })
    }

    if (!verifyAuth(auths)) {
        return res.status(400).json({
            message: 'Bad request'
        })
    }

    Level
        .findById(id)
        .then(level => {
            if (!level) {
                return res.status(404).json({
                    message: 'Not found'
                })
            }

            // verifier les auths
            const error = queryCheckUpdateAuth(level, auths);
            if (error) {
                return res.status(400).json(error);
            }

            const bulkOps = auths.map(auth => {
                if (auth.id) {
                    return {
                        updateOne: {
                            filter: { _id: auth.id },
                            update: { $set: { access: auth.access } }
                        }
                    };
                } else {
                    return {
                        insertOne: {
                            document: new Auth({
                                access: auth.access,
                                entity: level.auths[0].entity
                            })
                        }
                    };
                }
            });

            Auth
                .bulkWrite(bulkOps)
                .then((resultt) => {
                    // recuperer les auths
                    const updatedAuths = auths.map((auth, index) => {
                        return auth.id || resultt.insertedIds[index]
                    });

                    // mis a jour du level
                    Level
                        .updateOne({ _id: id }, {
                            $set: {
                                name: name,
                                size: size,
                                auths: updatedAuths
                            }
                        })
                        .then(() => {
                            res
                                .status(200)
                                .json({ msg: 'Updated' })
                        })
                        .catch(err => {
                            logger.error(err)
                            res.status(500).json({
                                msg: 'error server',
                                error: err.message
                            });
                        });
                })
                .catch(err => {
                    logger.error(err)
                    res.status(500).json({
                        msg: 'error server',
                        error: err.message
                    })
                })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({
                msg: 'error server',
                error: err.message
            })
        })
}

// lire
exports.getLevel = (req, res, next) => {
    /**
     * params: id
     */
    const { id } = req.params
    Level
        .find(id ? { _id: id } : {})
        .populate('auths')
        .then(levels => {
            if (!levels) {
                return res.status(404).json({
                    msg: 'Not found'
                })
            }

            res
                .status(200)
                .json({
                    values: id ? levels[0] : levels,
                    msg: 'Ok'
                })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({
                msg: 'error server',
                error: err.message
            })
        })
}

// supprimer
exports.deleteLevel = (req, res, next) => {
    /**
     * params: id
     */
    const { id } = req.params
    Level
        .find(id ? { _id: id } : {})
        .populate('auths')
        .then(levels => {
            if (!levels) {
                return res.status(404).json({
                    msg: 'Not found'
                })
            }

            const deleteAuths = Array.isArray(levels) ? levels.flatMap(
                level => level.auths.map(auth => auth._id)
            ) : levels.auths.map(auth => auth._id)

            Level
                .deleteMany({ _id: { $in: deleteAuths } })
                .then(() => {
                    const ids = Array.isArray(levels) ? levels.map(level => level._id) : levels._id

                    Level
                        .deleteMany({ _id: { $in: ids } })
                        .then(() => res.status(204).send())
                        .catch(err => {
                            logger.error(err)
                            res.status(500).json({
                                msg: 'error server',
                                error: err.message
                            })
                        })

                })
                .catch(err => {
                    logger.error(err)
                    res.status(500).json({
                        msg: 'error server',
                        error: err.message
                    })
                })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({
                msg: 'error server',
                error: err.message
            })
        })
}

// lire suivant une recherche
exports.getFindLevel = (req, res, next) => {
    /**
     * createdAt:
     *  min: Date
     *  max: Date
     * auth:
     *  access: String
     *  entity: String
     */

    const { createdAt, auth } = req.body

    // check
    const query = queryCheckAuth(
        queryCheckCreatedAt({}, createdAt),
        auth
    );

    Level
        .find(query)
        .populate('auths')
        .then(levels => {
            if (!levels) {
                return res.status(404).json({
                    msg: 'Not found'
                })
            }

            res
                .status(200)
                .json({
                    values: levels,
                    msg: 'Ok'
                });
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({
                msg: 'error server',
                error: err.message
            });
        });
}

// supprimer suivant une recherche
exports.deleteFindLevel = (req, res, next) => {
    /**
     * createdAt:
     *  min: Date
     *  max: Date
     * auth:
     *  access: String
     *  entity: String
     */

    const { createdAt, auth } = req.body

    // check
    const query = queryCheckAuth(
        queryCheckCreatedAt({}, createdAt),
        auth
    );

    Level
        .find(query)
        .populate('auths')
        .then(levels => {
            if (!levels) {
                return res.status(404).json({
                    msg: 'Not found'
                })
            }

            const deleteAuths = levels.flatMap(
                level => level.auths.map(auth => auth._id)
            )

            Level
                .deleteMany({ _id: { $in: levels.map(level => level._id) } })
                .then(() => {
                    // supprimer les auths
                    Auth
                        .deleteMany({ _id: { $in: deleteAuths } })
                        .then(() => res.status(204).send())
                        .catch(err => {
                            logger.error(err)
                            res.status(500).json({
                                msg: 'error server',
                                error: err.message
                            })
                        })
                })
                .catch(err => {
                    logger.error(err)
                    res.status(500).json({
                        msg: 'error server',
                        error: err.message
                    })
                })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({
                msg: 'error server',
                error: err.message
            })
        })
}

// nombre de level existant
exports.countLevel = (req, res, next) => {
    /**
     * createdAt:
     *  min: Date
     *  max: Date
     * auth:
     *  access: String
     *  entity: String
     */

    const { createdAt, auth } = req.body
    
    // check
    const query = queryCheckAuth(
        queryCheckCreatedAt({}, createdAt),
        auth
    );

    Level
        .countDocuments(query)
        .then(count => {
            res
                .status(200)
                .json({
                    values: count,
                    msg: 'Ok'
                });
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({
                msg: 'error server',
                error: err.message
            });
        });
}
