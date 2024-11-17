// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

// const User = require('../models/user');
// const logger = require('../logger');
// require('dotenv').config();

// const other = require('../utils/other')
// const send = require('../utils/send')
// const filters = require('../utils/filters')


// exports.register = (req, res, next) => {
//     /**
//      * email
//      * password
//      */
    
//     // verifier qu'un utilisateur avec cet email n'existe pas deja
//     User.findOne({
//         email: req.body.email
//     })
//     .then(user => {
//         if (user) return res.status(400).json({
//             msg: `sorry ${req.body.email} already exists !!!` 
//         })

//         // crypter le password
//         bcrypt.hash(req.body.password, 10)
//         .then(hash => {
//             // creer le user
//             const user = new User({
//                 email: req.body.email,
//                 password: hash
//             })

//             user.save()
//             .then(user => res.status(201).json({
//                 store: filters.userWithOutOTP(user),
//                 msg: 'user created successfully'
//             }))
//             .catch(err => {
//                 logger.error(err)
//                 res.status(500).json({ msg: err })
//             })
//         })
//         .catch(err => {
//             logger.error(err)
//             res.status(500).json({ msg: err })
//         })
//     })
//     .catch(err => {
//         logger.error(err)
//         res.status(500).json({ msg: err })
//     })
// }


// exports.login = (req, res, next) => {
//     /**
//      * email
//      * password
//      */
    
//     // verifier si l'utilisateur exists
//     User.findOne({
//         email: req.body.email
//     })
//     .then(user => {
//         // verifier si son compte est marquer supprimer ou suspendu
//         if (!user || user.status === 'delete') {
//             logger.error(`${req.body.email} don't exists !!!`)
//             return res.status(404).json({ msg: `${req.body.email} don't exists !!!` })
//         } else if (user && user.status === 'suspend') {
//             return res.status(403).json({ msg: 'contact admin please !!!' })
//         }
        
//         // verifier le password
//         bcrypt.compare(req.body.password, user.password)
//         .then(valid => {
//             if (!valid) {
//                 logger.error('password invalid')
//                 return res.status(400).json({ msg: 'password invalid' })
//             }
            
//             User.updateOne(
//                 { email: user.email },
//                 {
//                     isAuthenticated: true,
//                     status: 'active'
//                 }
//             )
//             .then(() => {
//                 User.findOne({
//                     email: user.email
//                 })
//                 .then(_user => res.status(200).json({
//                     store: filters.userWithOutOTP(_user),
//                     token: jwt.sign(
//                         { userId: _user._id },
//                         filters.JWTokenChoice(_user),
//                         { expiresIn: '72h' }
//                     ),
//                     msg: 'login successfully'
//                 }))
//                 .catch(err => {
//                     logger.error(err)
//                     res.status(500).json({ msg: err })
//                 })
//             })
//             .catch(err => {
//                 logger.error(err)
//                 res.status(500).json({ msg: err })
//             })
//         })
//         .catch(err => {
//             logger.error(err)
//             res.status(500).json({ msg: err })
//         })
//     })
//     .catch(err => {
//         logger.error(err)
//         res.status(500).json({ msg: err })
//     })
// }


// exports.logout = (req, res, next) => {
//     User.updateOne(
//         { _id: req.auth.userId },
//         {
//             isAuthenticated: false,
//             status: 'inactive'
//         }
//     )
//     .then(() => res.status(204).json())
//     .catch(err => {
//         logger.error(err)
//         res.status(500).json({ msg: err })
//     })
// }


// exports.forgot = (req, res, next) => {
//     /**
//      * email
//      */
//     User.findOne({
//         email: req.body.email
//     })
//     .then(user => {
//         if (!user) {
//             logger.error(`${req.body.email} don't exists !!!`)
//             return res.status(404).json({ msg: `${req.body.email} don't exists !!!` })
//         }
//         // envoyer un OTP par email
//         const code = other.keygen(4)
//         User.updateOne(
//             { email: user.email },
//             { otp: code }
//         )
//         .then(() => {
//             const r = send(to=user.email, subject='One-Time password', text=code)
//             if (r === true) {
//                 return res.status(200).json()
//             } else {
//                 return res.status(502).json({ msg: r })
//             }
//         })
//         .catch(err => {
//             logger.error(err)
//             res.status(500).json({ msg: err })
//         })
//     })
//     .catch(err => {
//         logger.error(err)
//         res.status(500).json({ msg: err })
//     })
// }


// exports.otp = (req, res, next) => {
//     /**
//      * email
//      * otp
//      */
//     User.findOne({
//         email: req.body.email,
//         otp: req.body.otp
//     })
//     .then(user => {
//         if (!user) {
//             return res.status(404).json({ msg: 'not found' })
//         }
//         return res.status(200).json({ msg: 'otp successfully' })
//     })
//     .catch(err => {
//         logger.error(err)
//         res.status(500).json({ msg: err })
//     })
// }


// exports.reset = (req, res, next) => {
//     /**
//      * email
//      * password
//      */
//     User.findOne({
//         email: req.body.email
//     })
//     .then(user => {
//         // crypter le password
//         bcrypt.hash(req.body.password, 10)
//         .then(hash => {
//             User.updateOne(
//                 { email: user.email },
//                 {
//                     password: hash,
//                     otp: undefined,
//                     isAuthenticated: false,
//                     status: 'inactive'
//                 }
//             )
//             .then(() => res.status(200).json({
//                 msg: 'user updated successfully'
//             }))
//             .catch(err => {
//                 logger.error(err)
//                 res.status(500).json({ msg: err })
//             })
//         })
//         .catch(err => {
//             logger.error(err)
//             res.status(500).json({ msg: err })
//         })
//     })
//     .catch(err => {
//         logger.error(err)
//         res.status(500).json({ msg: err })
//     })
// }
