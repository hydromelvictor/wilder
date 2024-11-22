require('dotenv').config();


const User = require('../models/user');



exports.getOneUser = (req, res, next) => {

    const userId = req.auth.otherUserId || req.auth.userId
    
    User
        .findOne({ _id: userId })
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
        .then(user => {
            if (!user) {
                return res.status(404).json({ msg: 'user not found' })
            }
            return res.status(200).json({
                store: user,
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


exports.getAllUsers = (req, res, next) => {
    User
        .find()
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
