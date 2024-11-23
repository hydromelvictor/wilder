require('dotenv').config();


const User = require('../../models/user/user');
const logger = require('../../logger');
const action = require('../../utils/action');


exports.getUsers = (req, res, next) => {

    const { author } = req.auth;
    const { id } = req.params;

    if (!author) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (!id && !author.staff) {
        return res.status(400).json({ msg: 'You do not have permission to read users' })
    }

    const actioner = action(author, 'user')

    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }
    
    User
        .find( id ? { _id: id } : {})
        .populate('gps')
        .populate('group')
        .then(users => {
            if (!users || users.length === 0) {
                return res.status(404).json({ msg: 'users not found' })
            }
            return res.status(200).json({
                store: id ? users[0] : users,
                msg: 'get user'
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


exports.getUserFriends = (req, res, next) => {
    const { author } = req.auth;
    const { id } = req.params;

    if (!author || !id) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(author, 'user')

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
    const { author } = req.auth;
    const { id } = req.params;

    if (!author || !id) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(author, 'user')
    
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
    const { author } = req.auth;
    const { id } = req.params;

    if (!author || !id) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(author, 'user')

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
    const { author } = req.auth;
    const { id } = req.params;

    if (!author || !id) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(author, 'user')

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
    const { author } = req.auth;
    const { id } = req.params;

    if (!author || !id) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(author, 'user')

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
    const { author } = req.auth;
    
    if (!author) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(author, 'user')

    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    User
        .find({ friends: { $in: author.friends } })
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
    const { author } = req.auth;

    if (!author) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(author, 'user')

    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    User
        .find({ followers: { $in: author.followers } })
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
    const { author } = req.auth;

    if (!author) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(author, 'user')

    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    User
        .find({ followings: { $in: author.followings } })
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
    const { author } = req.auth;

    if (!author) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(author, 'user')

    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    User
        .find({ friends: { $in: author.friends }, online: true })
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


exports.getSearchedUsers = (req, res, next) => {
    const { search } = req.body

    User
        .find({ $text: { $search: search } })
        .populate('email')
        .populate('phone')
        .populate('imageUrl')
        .populate('firstname')
        .populate('lastname')
        .populate('birth')
        .populate('sex')
        .populate('country')
        .populate('city')
        .populate('street')
        .populate('gps')
        .populate('group')
        .populate('level')
        .populate('friends')
        .populate('followers')
        .populate('followings')
        .populate('blocked')
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


exports.updateOneUser = (req, res, next) => {
    const userId = req.auth.otherUserId || req.auth.userId

    const { username, bio, state } = req.body

    User
        .findOne({ _id: userId })
        .then(user => {
            User
                .updateOne(
                    { _id: user._id },
                    {
                        username: username || user.username,
                        bio: bio || user.bio,
                        state: state || user.state
                    }
                )
                .then(user => res.status(200).json({
                    store: user._id,
                    msg: 'user upated successfully'
                }))
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



exports.criticalUpdate = (req, res, next) => {
    const userId = req.auth.otherUserId || req.auth.userId
    
    User
        .findOne({ _id: userId })
        .then(user => {
            if (!user) {
                return res.status(404).json({ msg: 'user not found' })
            }
            
            if (!(req.body.status in ['waiting', 'active', 'inactive', 'delete', 'suspend'])) {
                return res.status(400).json({ msg: 'status not valid' })
            }

            User
                .updateOne(
                    { _id: user._id },
                    {
                        isAuthenticated: user.isAuthenticated ? false : true,
                        online: user.online ? false : true,
                        status: req.body.status || user.status,
                    }
                )
                .then(user => res.status(200).json({
                    store: user._id,
                    msg: 'user upated successfully'
                }))
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


exports.deleteOneUser = (req, res, next) => {
    const userId = req.auth.otherUserId || req.auth.userId
    
    User
        .findOne({ _id: userId })
        .then(user => {
            if (!user) {
                return res.status(404).json({ msg: 'user not found' })
            }

            User
                .updateOne(
                    { _id: user._id },
                    {
                        email: 'delete' + user.email,
                        status: 'delete',
                        isAuthenticated: false,
                        online: false
                    }
                )
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


exports.deleteAllUsers = (req, res, next) => {
    User
        .deleteMany()
        .then(() => res.status(204).json())
        .catch(err => {
            logger.error(err)
            return res.status(500).json({ 
                msg: 'error',
                err: err.message
            })
        })
}


exports.deleteSearchedUsers = (req, res, next) => {
    const { search } = req.body

    User
        .deleteMany({ $text: { $search: search } })
        .then(() => res.status(204).json())
        .catch(err => {
            logger.error(err)
            return res.status(500).json({ 
                msg: 'error',
                err: err.message
            })
        })
}


exports.deleteUsers = (req, res, next) => {
    const { users } = req.body

    User
        .deleteMany({ _id: { $in: users } })
        .then(() => res.status(204).json())
        .catch(err => {
            logger.error(err)
            return res.status(500).json({ 
                msg: 'error',
                err: err.message
            })
        })
}


exports.countUsers = (req, res, next) => {
    User
        .countDocuments()
        .then(count => res.status(200).json({
            store: count,
            msg: 'count users'
        }))
        .catch(err => {
            logger.error(err)
            return res.status(500).json({ 
                msg: 'error',
                err: err.message
            })
        })
}
