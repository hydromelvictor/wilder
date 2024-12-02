const Notify = require('../../models/audit/notify');
const User = require('../../models/user');
const logger = require('../../logger');
const action = require('../../utils/action');


exports.createNotify = (req, res, next) => {
    const { message, level, title, receiver } = req.body

    if (!message || !level || title || receiver) {
        return res.status(400).json({ msg: 'data required'})
    }

    User
        .findOne({ _id: receiver})
        .then(user => {
            if (!user) {
                return res.status(400).json({ msg: 'User not found' })
            }
            
            const notify = new Notify({
                owner: user._id,
                title: title,
                message: message,
                level: level
            })
        
            notify
                .save()
                .then(notify => res.status(201).json({
                    store: notify._id,
                    msg: 'notify created'
                }))
                .catch(err => {
                    logger.error(err)
                    res.status(500).json({
                        msg: 'error while creating notify',
                        error: err.message
                    })
                })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({
                msg: 'error',
                error: err.message
            })
        })
}


exports.getNotify = (req, res, next) => {
    const { user } = req.auth;
    const { id } = req.params

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (!id) {
        return res.status(400).json({ msg: 'id required' })
    }

    Notify
        .findOne({ _id: id})
        .then(notify => {
            if (!notify) {
                return res.status(400).json({ msg: 'notify not found' })
            }

            if (notify.owner !== user._id && !user.staff) {
                return res.status(403).json({ msg: 'Unauthorized !!!'})
            }

            res.status(200).json({
                store: notify,
                msg: 'get notify'
            })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({
                msg: 'error',
                error: err.message
            })
        })
}


exports.getUserNotify = (req, res, next) => {
    const { user } = req.auth;
    const { id } = req.params
    //?page=1&limit=10
    const { page = 1, limit = 10 } = req.query

    const offset = (page - 1) * limit;

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (!id) {
        return res.status(400).json({ msg: 'id required' })
    }

    User
        .findOne({ _id: id})
        .then(owner => {
            if (!owner) {
                return res.status(400).json({ msg: 'User not found' })
            }

            if (owner._id !== user._id && !user.staff) {
                return res.status(403).json({ msg: 'Unauthorized !!!'})
            }

            Notify
                .find({ owner: owner._id})
                .skip(parseInt(offset))
                .limit(parseInt(limit))
                .then(notifies => {
                    if (!notifies || notifies.length === 0) {
                        return res.status(404).json({ msg: 'notify not found'})
                    }

                    const totalItems = this.countNotify(req, res, next).store
                    const hasPrevPage = page > 1
                    const hasNextPage = (offset + limit) < totalItems

                    res.status(200).json({
                        store: notifies,
                        pagination: {
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
                    })
                })
                .catch(err => {
                    logger.error(err)
                    res.status(500).json({
                        msg: 'error',
                        error: err.message
                    })
                })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({
                msg: 'error',
                error: err.message
            })
        })
}


exports.markOnReadOrNoRead = (req, res, next) => {
    const { user } = req.auth;
    const { id } = req.params

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (!id) {
        return res.status(400).json({ msg: 'id required' })
    }

    Notify
        .findOne({ _id: id, owner: user._id, status: { $in: ['noRead', 'read']}})
        .then(notify => {
            if (!notify) {
                return res.status(400).json({ msg: 'notify not found' })
            }

            Notify
                .updateOne(
                    { _id: notify._id},
                    { status: notify.status === 'read' ? 'noRead' : 'read' }
                )
                .then(() => res.status(200).json())
                .catch(err => {
                    logger.error(err)
                    res.status(500).json({
                        msg: 'error',
                        error: err.message
                    })
                })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({
                msg: 'error',
                error: err.message
            })
        })
}


exports.deleteUserNotify = (req, res, next) => {
    const { user } = req.auth;
    const { id } = req.params

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (!id) {
        return res.status(400).json({ msg: 'id required' })
    }

    Notify
        .findOne({ _id: id, owner: user._id, status: { $in: ['noRead', 'read']}})
        .then(notify => {
            if (!notify) {
                return res.status(400).json({ msg: 'notify not found' })
            }

            Notify
                .updateOne(
                    { _id: notify._id},
                    { status: notify.status === 'read' ? 'readAndDelete' : 'noReadAndDelete' }
                )
                .then(() => res.status(200).json())
                .catch(err => {
                    logger.error(err)
                    res.status(500).json({
                        msg: 'error',
                        error: err.message
                    })
                })
    })
    .catch(err => {
        logger.error(err)
        res.status(500).json({
            msg: 'error',
            error: err.message
        })
    })
}

exports.deleteNotify = (req, res, next) => {
    const { user } = req.auth;
    const { id } = req.params

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (!id) {
        return res.status(400).json({ msg: 'id required' })
    }

    if (!user.staff) {
        return res.status(400).json({ msg: 'Unauthorized' })
    }

    Notify
        .findOne({ _id: id})
        .then(notify => {
            if (!notify) {
                return res.status(400).json({ msg: 'notify not found' })
            }

            if (notify.owner === owner._id) {
                return res.status(400).json({ msg: 'Unauthorized' })
            }

            Notify
                .deleteOne({ _id: notify._id})
                .then(() => res.status(204).json())
                .catch(err => {
                    logger.error(err)
                    res.status(500).json({
                        msg: 'error',
                        error: err.message
                    })
                })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({
                msg: 'error',
                error: err.message
            })
        })
}


exports.countNotify = (req, res, next) => {
    const { user } = req.auth;
    const { id } = req.params

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (!id) {
        return res.status(400).json({ msg: 'id required' })
    }

    User
        .findOne({ _id: id})
        .then(owner => {
            if (!owner) {
                return res.status(400).json({ msg: 'user not found'})
            }

            Notify
                .countDocuments({ owner: owner._id})
                .then(count => res.status(200).json({
                    store: count,
                    msg: 'count'
                }))
                .catch(err => {
                    logger.error(err)
                    res.status(500).json({
                        msg: 'error',
                        error: err.message
                    })
                })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({
                msg: 'error',
                error: err.message
            })
        })
}
