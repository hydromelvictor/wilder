const Log = require('../../models/audit/log');
const User = require('../../models/user');
const logger = require('../../logger');
const action = require('../../utils/action');


exports.createLog = (req, res, next) => {
    const { user } = req.auth;
    const { action, resName, resId } = req.body;

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (!action || !resName || !resId) {
        return res.status(400).json({ msg: 'data required'})
    }

    const log = new Log({
        owner: user._id,
        action: action,
        ipAddress: user.engine.ipAddress,
        device: {
            name: user.engine.appareil,
            navigator: user.engine.navigator,
            os: user.engine.os,
            version: user.engine.versionDevice
        },
        ressource: {
            name: resName,
            id: resId
        }
    })

    log
        .save()
        .then(log => res.status(201).json())
        .catch(err => {
            logger.error(err)
            return res.status(500).json({
                msg: 'error while creating log audit',
                error: err.message
            })
        })
}


exports.getLog = (req, res, next) => {
    const { user } = req.auth;
    const { id } = req.params

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (!user.staff) {
        return res.status(403).json({ msg: 'Unauthorized !!!'})
    }

    if (!id) {
        return res.status(400).json({ msg: 'id required' })
    }

    const actioner = action(user, 'log')

    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    Log
        .findOne({ _id: id})
        .populate('owner')
        .then(log => {
            if (!log) {
                return res.status(404).json({ msg: 'log not found'})
            }
            res.status(200).json({
                store: log,
                msg: 'get log'
            })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({
                msg: 'error while get log audit',
                error: err.message
            })
        })
}

exports.geUserLogs = (req, res, next) => {
    const { user } = req.auth;
    const { id } = req.params
    //?page=1&limit=10
    const { page = 1, limit = 10 } = req.query

    const offset = (page - 1) * limit;

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (!user.staff) {
        return res.status(403).json({ msg: 'Unauthorized !!!'})
    }

    if (!id) {
        return res.status(400).json({ msg: 'id required' })
    }

    const actioner = action(user, 'log')

    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    Log
        .find({ owner: id })
        .populate('owner')
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .then(logs => {
            if (!logs || logs.length === 0) {
                return res.status(404).json({ msg: 'log not found'})
            }

            const totalItems = this.countLog(req, res, next).store
            const hasPrevPage = page > 1
            const hasNextPage = (offset + limit) < totalItems

            res.status(200).json({
                store: logs,
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
                msg: 'logs from user'
            })

        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({
                msg: 'error while creating log audit',
                error: err.message
            })
        })
}


exports.deleteUserLogs = (req, res, next) => {
    const { user } = req.auth;
    const { owner } = req.params

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (!user.staff) {
        return res.status(403).json({ msg: 'Unauthorized !!!'})
    }

    if (!owner) {
        return res.status(400).json({ msg: 'id required' })
    }

    const actioner = action(user, 'log')

    if (!actioner.group.isExec) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    Log
        .find({ owner: owner})
        .then(logs => {
            if (!logs) {
                return res.status(404).json({ msg: 'log not found'})
            }

            Log
                .deleteMany({ owner: owner})
                .then(() => res.status(204).json())
                .catch(err => {
                    logger.error(err)
                    return res.status(500).json({ 
                        msg: 'error',
                        err: err.message
                    })
                })
        })
        .catch(err => {
            logger.error(err)
            return res.status(500).json({ 
                msg: 'error',
                err: err.message
            })
        })

}


exports.countLog = (req, res, next) => {
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

            Log
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
