const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const User = require('../../models/user/index');
const Group = require('../../models/base/group');

const logger = require('../../logger');
const action = require('../../utils/action');
const {
    getInternationalPhoneNumber,
    getCountryName,
    isValidPhoneNumber
} = require('../../utils/filters');
require('dotenv').config();



// register a new user
exports.signup = (req, res, next) => {
    /**
     * username
     * phone
     * group
     * password
     */

    const { author } = req.auth;

    if (author && !author.staff) return res.status(403).json({ msg: 'Unauthorized access' });

    const actioner = author ? action(author, 'user'): null;

    if (author && actioner && !actioner.group.isWrite) return res.status(403).json({ msg: 'Unauthorized access' });

    const { username, phone, password, group } = req.body;
    
    if (!username || !phone || !password ) {
        return res.status(400).json({ msg: 'please fill all fields' })
    }

    if (username.includes('_')) {
        return res.status(403).json({ msg: '_ not authorize in name'})
    }

    // verifier si l'utilisateur existe
    User
        .findOne({ username: username })
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
                        .findOne({ name: author ? group : 'user' })
                        .then(group => {
                            if (!group) return res.status(404).json({ msg: 'group not found' })
                            
                            // crypter le password
                            bcrypt
                                .hash(password, 10)
                                .then(hash => {
                            
                                    // creer l'utilisateur
                                    const newUser = new User({
                                        username: username,
                                        phone: {
                                            value: normalPhone,
                                            isPublic: true
                                        },
                                        country: {
                                            value: country,
                                            isPublic: true
                                        },
                                        group: group._id,
                                        staff: (author && group.name !== 'user') ? true : false,
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
}


// login a user
exports.login = (req, res, next) => {
    /**
     * phone or username
     * password
     */
    
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: 'please fill all fields' })
    }

    // verifier si l'utilisateur existe
    User
        .findOne({ username: username })
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

    const { user } = req.auth;

    if (!user) return res.status(404).json({ msg: 'user not found' });

    User
        .updateOne(
            { _id: user._id },
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
    
    const { user } = req.auth;

    if (!user) return res.status(404).json({ msg: 'user not found' });

    return res.status(200).json({
        store: user._id,
        token: jwt.sign(
            { _id: user._id },
            process.env.JWT_USER_SECRET,
            { expiresIn: '24h' }
        ),
        msg: 'token refreshed successfully'
    })
}


// forgot password
exports.forgot = (req, res, next) => {
    /**
     * phone or username
     */

    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ msg: 'please fill all fields' })
    }

    // verifier si l'utilisateur existe
    User
        .findOne({ username: username })
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

    const { author } = req.auth;

    const actioner = author ? action(author, 'user') : null;

    if (author && actioner && !actioner.group.isWrite) return res.status(403).json({ msg: 'Unauthorized access' });

    const { username, password } = req.body;

    if (!author && !username || !password) {
        return res.status(400).json({ msg: 'please fill all fields' })
    }

    // verifier si l'utilisateur existe
    User
        .findOne({ username: author ? author.username : username })
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
