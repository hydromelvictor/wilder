// const bcrypt = require('bcrypt');
// require('dotenv').config();

// const filters = require('../utils/filters')
// const User = require('../models/user');
// const logger = require('../logger');
// const { level } = require('winston');



// exports.getUser = (req, res, next) => {
//     User.findOne({ _id: req.auth.userId })
//     .then(user => res.status(200).json({
//         store: filters.userWithOutOTP(user),
//         msg: 'get user'
//     }))
//     .catch(err => {
//         logger.error(err)
//         return res.status(500).json({ msg: err})
//     })
// }


// exports.updateUser = (req, res, next) => {
//     User.findOne({ _id: req.auth.userId })
//     .then(user => {
//         User.updateOne(
//             { _id: user._id },
//             { 
//                 ...req.body,
//                 password: user.password,
//                 isAuthenticated: user.isAuthenticated,
//                 status: user.status,
//                 otp: user.otp
//             }
//         )
//         .then(user => res.status(200).json({
//             store: filters.userWithOutOTP(user),
//             msg: 'user upated successfully'
//         }))
//         .catch(err => {
//             logger.error(err)
//             return res.status(500).json({ msg: err})
//         })
//     })
//     .catch(err => {
//         logger.error(err)
//         return res.status(500).json({ msg: err})
//     })
// }

// exports.passwordUpdate = (req, res, next) => {
//     bcrypt.hash(req.body.password, 10)
//     .then(hash => {
//         User.updateOne(
//             { _id: req.auth.userId },
//             {
//                 password: hash,
//                 isAuthenticated: false,
//                 status: 'inactive'
//             }
//         )
//         .then(() => res.status(200).json({ msg: 'password updated successfully'}))
//         .catch(err => {
//             logger.error(err)
//             return res.status(500).json({ msg: err})
//         })
//     })
//     .catch(err => {
//         logger.error(err)
//         return res.status(500).json({ msg: err})
//     })
// }


// exports.userDelete = (req, res, next) => {
//     User.findOne({ _id: req.auth.userId })
//     .then(user => {
//         User.updateOne(
//             { _id: user._id },
//             {
//                 email: 'delete' + user.email,
//                 status: 'delete',
//                 isAuthenticated: false
//             }
//         )
//         .then(() => res.status(204).json())
//         .catch(err => {
//             logger.error(err)
//             return res.status(500).json({ msg: err})
//         })
//     })
//     .catch(err => {
//         logger.error(err)
//         return res.status(500).json({ msg: err})
//     })
// }
