// const filters = require('../../utils/filters')
// const User = require('../../models/user');
// const Secure = require('../../models/security')
// const logger = require('../../logger');

// const bcrypt = require('bcrypt');


// exports.getUserByAdmin = (req, res, next) => {
//     User.findOne({ _id: req.params.id })
//     .then(user => res.status(200).json({
//         store: filters.userWithOutPasswordAndOTP(user),
//         msg: 'get user'
//     }))
//     .catch(err => {
//         logger.error(err)
//         return res.status(500).json({ msg: err})
//     })
// }


// exports.getUsers = (req, res, next) => {
//     User.find({})
//     .then(users => res.status(200).json({
//         store: users.map((user) => filters.userWithOutPasswordAndOTP(user)),
//         msg: 'all users'
//     }))
//     .catch(err => {
//         logger.error(err)
//         return res.status(500).json({ msg: err})
//     })
// }


// exports.userStatusUpdate = (req, res, next) => {
//     if (!(req.body.status in ['active', 'inactive', 'delete', 'suspend'] )) res.status(404).json({ msg: 'not found status' })
    
//     User.updateOne(
//         { _id: req.params.id },
//         { 
//             status: req.body.status,
//             isAuthenticated: false
//         }
//     )
//     .then(()=> res.status(200).json({ msg: 'status updated successfully'}))
//     .catch(err => {
//         logger.error(err)
//         return res.status(500).json({ msg: err})
//     })
// }

// exports.superUserPasswordUpdate = (req, res, next) => {
//     Secure.findOne()
//     .then(secure => {
//         if (req.body.token !== secure.token) return res.status(401).json({ msg: 'Unauthorized !!!'});
        
//         User.findOne({ _id: req.auth.userId })
//         .then(user => {
//             if (user.role !== 'superuser') return res.status(401).json({ msg: 'Unauthorized !!!'});
            
//             bcrypt.hash(req.body.password, 10)
//             .then(hash => {
//                 User.updateOne(
//                     { _id: req.auth.userId },
//                     {
//                         password: hash,
//                         isAuthenticated: false,
//                         status: 'inactive'
//                     }
//                 )
//                 .then(() => res.status(200).json({ msg: 'password updated successfully'}))
//                 .catch(err => {
//                     logger.error(err)
//                     return res.status(500).json({ msg: err})
//                 })
//             })
//             .catch(err => {
//                 logger.error(err)
//                 return res.status(500).json({ msg: err})
//             })
//         })
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


// exports.AdminRegister = (req, res, next) => {
//     Secure.findOne()
//     .then(secure => {
//         if (req.body.token !== secure.token) return res.status(401).json({ msg: 'Unauthorized !!!'});
        
//         User.findOne({ _id: req.auth.userId })
//         .then(user => {
//             if (user.role !== 'superuser') return res.status(401).json({ msg: 'Unauthorized !!!'});

//             bcrypt.hash(req.body.password, 10)
//             .then(hash => {
//                 const user = new User({
//                     email: req.body.email,
//                     password: hash,
//                     role: 'admin',
//                     staff: true
//                 })

//                 user.save()
//                 .then(() => res.status(200).json({ msg: 'admin created successfully'}))
//                 .catch(err => {
//                     logger.error(err)
//                     return res.status(500).json({ msg: err})
//                 })
//             })
//             .catch(err => {
//                 logger.error(err)
//                 return res.status(500).json({ msg: err})
//             })
//         })
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


// exports.DeleteUserByAdmin = (req, res, next) => {

// }


// exports.deleteUsers = (req, res, next) => {

// }
