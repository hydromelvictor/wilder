const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const User = require('../models/user');
const Level = require('../models/level');
const Group = require('../models/group');

const logger = require('../logger');
const {
    getInternationalPhoneNumber, 
    getCountryName,
    isValidPhoneNumber 
} = require('../utils/filters');
const { on } = require('nodemailer/lib/xoauth2');
require('dotenv').config();



// register a new user
exports.signup = (req, res, next) => {
    /**
     * username
     * phone
     * group
     * level
     * password
     */

    const { username, phone, password, group, level } = req.body;

    // verifier si l'utilisateur existe
    User
        .findOne({ _id: username })
        .then(user => {
            if (user) return res.status(400).json({
                msg: `sorry ${username} already exists !!!`
            })

            // verifier si le numero de telephone est valide
            if (!isValidPhoneNumber(phone)) return res.status(400).json({ msg: 'invalid phone number' })

            normalPhone = getInternationalPhoneNumber(phone)
            country = getCountryName(phone)

            // verifier si le numero de telephone existe et est valide
            User
                .findOne({ phone: normalPhone })
                .then(user => {
                    if (user) return res.status(400).json({
                        msg: `sorry ${phone} already exists !!!`
                    })

                    // verifier si le groupe existe
                    Group
                        .findOne({ name: group })
                        .then(group => {
                            if (!group) return res.status(404).json({ msg: 'group not found' })
                            
                            // verifier si le level existe
                            Level
                                .findOne({ name: level })
                                .then(level => {
                                    if (!level) return res.status(404).json({ msg: 'level not found' })

                                    // crypter le password
                                    bcrypt
                                        .hash(password, 10)
                                        .then(hash => {
                                        
                                            // creer l'utilisateur
                                            const newUser = new User({
                                                _id: username,
                                                phone: normalPhone,
                                                country: country,
                                                group: group._id,
                                                level: level._id,
                                                staff: req.auth.staff || false,
                                                password: hash
                                            })
                                        
                                            newUser
                                                .save()
                                                .then(user => res.status(201).json({
                                                    store: user._id,
                                                    msg: 'user created successfully'
                                                }))
                                                .catch(err => {
                                                    logger.error(err)
                                                    res.status(500).json({ 
                                                        msg: 'error while creating user',
                                                        error: err.message
                                                     })
                                                })
                                        })
                                        .catch(err => {
                                            logger.error(err)
                                            res.status(500).json({ 
                                                msg: 'error while creating user',
                                                error: err.message
                                             })
                                        })
                                })
                                .catch(err => {
                                    logger.error(err)
                                    res.status(500).json({ 
                                        msg: 'error while creating user',
                                        error: err.message
                                     })
                                })
                        })
                        .catch(err => {
                            logger.error(err)
                            res.status(500).json({ 
                                msg: 'error while creating user',
                                error: err.message
                             })
                        })
                })
                .catch(err => {
                    logger.error(err)
                    res.status(500).json({ 
                        msg: 'error while creating user',
                        error: err.message
                     })
                })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({ 
                msg: 'error while creating user',
                error: err.message
             })
        })
}


// login a user
exports.login = (req, res, next) => {
    /**
     * phone or username
     * password
     */
    
    const { username, password } = req.body;

    // verifier si l'utilisateur existe
    User
        .findOne({ $or: [
            { _id: username },
            { phone: username }
        ]})
        .then(user => {
            if (!user) return res.status(404).json({ msg: 'user not found' })

            // verifier le mot de passe
            bcrypt
                .compare(password, user.password)
                .then(valid => {
                    if (!valid) return res.status(401).json({ msg: 'wrong password' })
                    
                    // mettre a jour le status de l'utilisateur
                    User
                        .updateOne(
                            { _id: user._id },
                            { 
                                status: 'active',
                                isAuthenticated: true
                            }
                        )
                        .then(() => {
                            User
                                .findOne({ _id: user._id })
                                .then(_user => {
                                    res.status(200).json({
                                        store: _user._id,
                                        token: jwt.sign(
                                            { _id: _user._id },
                                            process.env.JWT_USER_SECRET,
                                            { expiresIn: '24h' }
                                        )
                                    })
                                })
                                .catch(err => {
                                    logger.error(err)
                                    res.status(500).json({ 
                                        msg: 'error while login',
                                        error: err.message
                                     })
                                })
                        })
                        .catch(err => {
                            logger.error(err)
                            res.status(500).json({ 
                                msg: 'error while login',
                                error: err.message
                             })
                        })
                })
                .catch(err => {
                    logger.error(err)
                    res.status(500).json({ 
                        msg: 'error while login',
                        error: err.message
                     })
                })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({ 
                msg: 'error while login',
                error: err.message
             })
        })
}


// logout a user
exports.logout = (req, res, next) => {
    User
        .updateOne(
            { _id: req.auth.userId },
            {
                status: 'waiting',
                isAuthenticated: false,
                online: false
            }
        )
        .then(() => res.status(204).json())
        .catch(err => {
            logger.error(err)
            res.status(500).json({ 
                msg: 'error while logout',
                error: err.message
            })
        })
}


// refresh a user token
exports.refresh = (req, res, next) => {
    User
        .findOne({ _id: req.auth.userId })
        .then(user => {
            if (!user) return res.status(404).json({ msg: 'user not found' })

            res.status(200).json({
                store: user._id,
                token: jwt.sign(
                    { _id: user._id },
                    process.env.JWT_USER_SECRET,
                    { expiresIn: '24h' }
                ),
                msg: 'token refreshed successfully'
            })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({ 
                msg: 'error while refreshing token',
                error: err.message
            })
        })
}


// forgot password
exports.forgot = (req, res, next) => {
    /**
     * phone or username
     */

    const { username } = req.body;

    // verifier si l'utilisateur existe
    User
        .findOne({ $or: [
            { _id: username },
            { phone: username }
        ]})
        .then(user => {
            if (!user) return res.status(404).json({ msg: 'user not found' })

            // generer un otp
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            res.status(200).json({ 
                store: otp,
                msg: 'otp generated successfully'
            })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({ 
                msg: 'error while reseting password',
                error: err.message
            })
        })
}


// reset password
exports.reset = (req, res, next) => {
    /**
     * phone or username
     * password
     */

    const { username, password } = req.body;

    // verifier si l'utilisateur existe
    User
        .findOne({ $or: [
            { _id: username },
            { phone: username }
        ]})
        .then(user => {
            if (!user) return res.status(404).json({ msg: 'user not found' })

            // crypter le password
            bcrypt
                .hash(password, 10)
                .then(hash => {
                    // mettre a jour le mot de passe
                    User
                        .updateOne(
                            { _id: user._id },
                            { 
                                password: hash,
                                status: 'waiting',
                                isAuthenticated: false,
                                online: false
                            }
                        )
                        .then(() => res.status(204).json())
                        .catch(err => {
                            logger.error(err)
                            res.status(500).json({ 
                                msg: 'error while reseting password',
                                error: err.message
                            })
                        })
                })
                .catch(err => {
                    logger.error(err)
                    res.status(500).json({ 
                        msg: 'error while reseting password',
                        error: err.message
                    })
                })
        })
        .catch(err => {
            logger.error(err)
            res.status(500).json({ 
                msg: 'error while reseting password',
                error: err.message
            })
        })
}
