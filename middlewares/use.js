const jwt = require('jsonwebtoken');
require('dotenv').config();

const logger = require('../logger');
const User = require('../models/user/index');


module.exports = async (req, res, next) => {
    try {
        req.auth = {}; // Initialise req.auth

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(); // Pas de header Authorization, passe au middleware suivant
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new Error('Token missing from authorization header');
        }

        // Vérifie et décode le token JWT
        const decodedToken = jwt.verify(token, process.env.JWT_USER_SECRET);
        if (!decodedToken || !decodedToken._id) {
            throw new Error('Invalid token');
        }

        // Récupère l'utilisateur depuis la base de données
        const authenticatedUser = await User
            .findOne({ _id: decodedToken._id })
            .populate({
                path: 'group',
                populate: {
                    path: 'auths',
                    model: 'Auth'
                }
            })
        console.log(authenticatedUser)
        if (!authenticatedUser) {
            throw new Error('User not found, please register');
        }

        if (!authenticatedUser.isAuthenticated) {
            throw new Error('User is not authenticated, please login');
        }

        if (authenticatedUser.status === 'suspend') {
            if (authenticatedUser.suspendedAt) {
                const suspendedDate = new Date(authenticatedUser.suspendedAt);
                const currentDate = new Date();
                const diffTime = Math.abs(currentDate - suspendedDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays >= 30) {
                    authenticatedUser.status = 'waiting';
                    await authenticatedUser.save();
                } else {
                    throw new Error(`User is suspended for bad behavior, please wait ${diffDays} days`);
                }
            }
        }

        if (!['active', 'inactive'].includes(authenticatedUser.status)) {
            throw new Error(`Login required, user status is ${authenticatedUser.status}`);
        }

        // Ajoute l'utilisateur authentifié dans req.auth
        req.auth.user = authenticatedUser;

        // Passe au middleware suivant
        next();
    } catch (err) {
        logger.error(err);

        const statusCode = err.message === 'User not found' ? 404 : 401;

        res.status(statusCode).json({
            msg: 'Authentication failed',
            error: err.message,
        });
    }
};
