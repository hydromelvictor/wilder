require('dotenv').config();
const fs = require('fs');


const User = require('../../models/user/index');
const logger = require('../../logger');
const action = require('../../utils/action');
const {
    getInternationalPhoneNumber,
    getCountryName,
    isValidPhoneNumber
} = require('../../utils/filters');


exports.getUsers = (req, res, next) => {

    const { user } = req.auth;
    const { id } = req.params;

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (!id && !user.staff) {
        return res.status(400).json({ msg: 'You do not have permission to read users' })
    }

    const actioner = action(user, 'user')
    
    if (!actioner.group.isRead) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }
    
    User
        .find( id ? { _id: id } : {})
        .populate('gps')
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


exports.updateUser = (req, res, next) => {
    /**
     * username
     * email
     * phone
     * imageUrl
     * firstname
     * lastname
     * birth
     * sex
     * city
     * street
     * bio
     * state
     */

    const { user } = req.auth

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const { 
        username,
        email,
        phone,
        firstname,
        lastname,
        birth,
        sex,
        city,
        street,
        bio, 
        state 
    } = req.body

    country = user.country
    imageUrl = user.imageUrl || null

    if (phone) {
        if (!isValidPhoneNumber(phone)) {
            return res.status(400).json({ msg: 'phone number not valid' })
        }
        country = getCountryName(phone)
        phone = getInternationalPhoneNumber(phone)
    }

    if (req.file) {
        imageUrl = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename

        if (user.imageUrl) {
            const filename = user.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {
                logger.info('image deleted')
            })
        }
    }

    User
        .updateOne(
            { _id: user._id },
            {
                username: username || user.username,
                email: email || user.email,
                phone: phone || user.phone,
                imageUrl: imageUrl,
                firstname: firstname || user.firstname,
                lastname: lastname || user.lastname,
                birth: birth || user.birth,
                sex: sex || user.sex,
                country: country,
                city: city || user.city,
                street: street || user.street,
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
}



exports.deleteOneUser = (req, res, next) => {

    const { user } = req.auth

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }
    
    if (user.staff) {
        res.status(403).json({ msg: 'You do not have permission to change status in delete' })
    }

    User
        .updateOne(
            { _id: user._id},
            {
                username: '_' + user.username,
                email: user.email ? '_' + user.email : null,
                phone: user.phone ? '_' + user.phone : null,
                isAuthenticated: false,
                online: false,
                state: 'hidden',
                status: 'delete'
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
