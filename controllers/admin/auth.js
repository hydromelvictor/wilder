// const bcrypt = require('bcrypt');

// const User = require('../../models/user');
// const Secure = require('../../models/security')

// const logger = require('../../logger');
// require('dotenv').config();

// const filters = require('../../utils/filters');


// exports.superUserRegister = (req, res, next) => {
//     /**
//      * email
//      * password
//      * token
//      */

//     Secure.findOne()
//     .then(secure => {
//         if (!secure) return res.status(404).json({ msg: 'secure not found' });
        
//         if (req.body.token !== secure.token) return res.status(401).json(
//             { msg: 'You are not performed for this action !!!' }
//         );

//         // verifier que l'email n'existe pas dans la base
//         User.findOne({
//             email: req.body.email
//         })
//         .then(user => {
//             if (user) return res.status(400).json(
//                 { msg: `sorry ${req.body.email} already exists !!!` }
//             );

//             // crypter le mot de pass
//             bcrypt.hash(req.body.password, 10)
//             .then(hash => {
//                 // creer le super user
//                 const user = new User({
//                     email: req.body.email,
//                     password: hash,
//                     role: 'superuser',
//                     staff: true
//                 })
                
//                 user.save()
//                 .then(user => res.status(201).json({
//                     store: filters.userWithOutOTP(user),
//                     msg: 'super user created successfully'
//                 }))
//                 .catch(err => {
//                     logger.error(err)
//                     return res.status(500).json({ msg: err })
//                 })
//             })
//             .catch(err => {
//                 logger.error(err)
//                 return res.status(500).json({ msg: err })
//             })
//         })
//         .catch(err => {
//             logger.error(err)
//             return res.status(500).json({ msg: err })
//         })
//     })
//     .catch(err => {
//         logger.error(err)
//         return res.status(500).json({ msg: err })
//     })
// }
