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
    //?page=1&limit=10
    const { page = 1, limit = 10 } = req.query

    const offset = (page - 1) * limit;

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
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .then(users => {
            if (!users || users.length === 0) {
                return res.status(404).json({ msg: 'users not found' })
            }

            const totalItems = this.countUsers(req, res, next).store
            const hasPrevPage = page > 1
            const hasNextPage = (offset + limit) < totalItems

            return res.status(200).json({
                store: id ? users[0] : users,
                pagination: id ? {} : {
                    totalItems: totalItems,
                    limit: limit,
                    page: page,
                    totalPages: Math.ceil(totalItems / limit),
                    pagingCounter: offset + 1,
                    hasPrevPage: hasPrevPage,
                    hasNextPage: hasNextPage,
                    prevPage: hasPrevPage ? page - 1 : null,
                    nextPage: hasNextPage ? page + 1 : null
                },
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
     * username, 
     * email,
     * emailView, 
     * phone,
     * phoneView, 
     * firstname,
     * firstnameView,
     * lastname,
     * lastnameView,
     * birth,
     * birthView,
     * sex,
     * countryView,
     * city,
     * cityView,
     * street,
     * streetView,
     * imageUrlView,
     * bio, 
     * state
     */

    const { user } = req.auth

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const { 
        username,
        email,
        emailView,
        phone,
        phoneView,
        firstname,
        firstnameView,
        lastname,
        lastnameView,
        birth,
        birthView,
        sex,
        countryView,
        city,
        cityView,
        street,
        streetView,
        imageUrlView,
        bio, 
        state
    } = req.body

    country = user.country.value
    imageUrl = user.imageUrl || null

    if (phone) {
        if (!isValidPhoneNumber(phone)) {
            return res.status(400).json({ msg: 'phone number not valid' })
        }
        country = getCountryName(phone)
        phone = getInternationalPhoneNumber(phone)
    }

    if (req.file) {
        imageUrl.value = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename
        imageUrl.isPublic = imageUrlView ? false : true

        if (user.imageUrl.value) {
            const filename = user.imageUrl.value.split('/images/')[1]
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
                email: {
                    value: email || user.email?.value,
                    isPublic: emailView ? false : true
                },
                phone: {
                    value: phone || user.phone?.value,
                    isPublic: phoneView ? false : true
                },
                imageUrl: imageUrl,
                firstname: {
                    value: firstname || user.firstname?.value,
                    isPublic: firstnameView ? false : true
                },
                lastname: {
                    value: lastname || user.lastname?.value,
                    isPublic: lastnameView ? false : true
                },
                birth: {
                    value: birth || user.birth?.value,
                    isPublic: birthView ? false : true
                },
                sex: sex || user.sex,
                country: {
                    value: country,
                    isPublic: countryView ? false : true
                },
                city: {
                    value: city || user.city?.value,
                    isPublic: cityView ? false : true
                },
                street: {
                    value: street || user.street?.value,
                    isPublic: streetView ? false : true
                },
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
    const { id } = req.auth

    const actioner = action(user, 'user')

    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }

    if (id && !actioner.group.isWrite) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }

    if (id && !user.staff) {
        res.status(403).json({ msg: 'You do not have permission to change status in delete' })
    }
    
    if (user.staff && id && user._id === id) {
        res.status(403).json({ msg: 'You do not have permission to change status in delete' })
    }

    User
        .updateOne(
            { _id: id ? id : user._id},
            {
                isAuthenticated: false,
                online: false,
                state: 'hidden',
                status: 'delete'
            }
        )
        .then(() => {
            // envoyer un sms pour supperssion dans 4semaine si non recuperer
            return res.status(204).json()
        })
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
