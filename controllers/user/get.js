require('dotenv').config();

const User = require('../../models/user/index');
const logger = require('../../logger');
const action = require('../../utils/action');


exports.getUserFriends = (req, res, next) => {
    const { user } = req.auth;
    const { id } = req.params;

    if (!user || !id) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(user, 'user')

    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    User
        .findOne({ _id: id })
        .populate('friends')
        .then(user => {
            if (!user) {
                return res.status(404).json({ msg: 'user not found' })
            }
            return res.status(200).json({
                store: user.friends,
                msg: 'get user friends'
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


exports.getUserRequests = (req, res, next) => {
    const { user } = req.auth;
    const { id } = req.params;

    if (!user || !id) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(user, 'user')
    
    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    User
        .findOne({ _id: id })
        .populate('requests')
        .then(user => {
            if (!user) {
                return res.status(404).json({ msg: 'user not found' })
            }
            return res.status(200).json({
                store: user.requests,
                msg: 'get user friend requests'
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

exports.getUserFollowers = (req, res, next) => {
    const { user } = req.auth;
    const { id } = req.params;

    if (!user || !id) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(user, 'user')

    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    User
        .findOne({ _id: id })
        .populate('followers')
        .then(user => {
            if (!user) {
                return res.status(404).json({ msg: 'user not found' })
            }
            return res.status(200).json({
                store: user.followers,
                msg: 'get user followers'
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

exports.getUserFollowings = (req, res, next) => {
    const { user } = req.auth;
    const { id } = req.params;

    if (!user || !id) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(user, 'user')

    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    User
        .findOne({ _id: id })
        .populate('followings')
        .then(user => {
            if (!user) {
                return res.status(404).json({ msg: 'user not found' })
            }
            return res.status(200).json({
                store: user.followings,
                msg: 'get user followings'
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

exports.getUserBlockeds = (req, res, next) => {
    const { user } = req.auth;
    const { id } = req.params;

    if (!user || !id) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(user, 'user')

    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    User
        .findOne({ _id: id })
        .populate('blockeds')
        .then(user => {
            if (!user) {
                return res.status(404).json({ msg: 'user not found' })
            }
            return res.status(200).json({
                store: user.blockeds,
                msg: 'get user blockeds'
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

// ceux avec qui vous avez les memes amis
exports.getUsersWithSameFriends = (req, res, next) => {
    const { user } = req.auth;
    
    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(user, 'user')

    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    User
        .find({ friends: { $in: user.friends } })
        .then(users => {
            if (!users || users.length === 0) {
                return res.status(404).json({ msg: 'users not found' })
            }
            return res.status(200).json({
                store: users,
                msg: 'get users with same friends'
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

// ceux avec qui vous avez les memes followers
exports.getUsersWithSameFollowers = (req, res, next) => {
    const { user } = req.auth;

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(user, 'user')

    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    User
        .find({ followers: { $in: user.followers } })
        .then(users => {
            if (!users || users.length === 0) {
                return res.status(404).json({ msg: 'users not found' })
            }

            return res.status(200).json({
                store: users,
                msg: 'get users with same followers'
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

// ceux avec qui vous avez les memes followings
exports.getUsersWithSameFollowings = (req, res, next) => {
    const { user } = req.auth;

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(user, 'user')

    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    User
        .find({ followings: { $in: user.followings } })
        .then(users => {
            if (!users || users.length === 0) {
                return res.status(404).json({ msg: 'users not found' })
            }

            return res.status(200).json({
                store: users,
                msg: 'get users with same followings'
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

// vos amis qui sont en ligne
exports.getOnlineFriends = (req, res, next) => {
    const { user } = req.auth;

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(user, 'user')

    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    User
        .find({ friends: { $in: user.friends }, online: true })
        .then(users => {
            if (!users || users.length === 0) {
                return res.status(404).json({ msg: 'users not found' })
            }

            return res.status(200).json({
                store: users,
                msg: 'get online friends'
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

// recherche d'utilisateurs
exports.getSearchedUsers = (req, res, next) => {
    const { search } = req.body

    User
        .find({ $text: { $search: search } })
        .populate('gps')
        .then(users => res.status(200).json({
            store: users,
            msg: 'get users'
        }))
        .catch(err => {
            logger.error(err)
            return res.status(500).json({ 
                msg: 'error',
                err: err.message
            })
        })
}
