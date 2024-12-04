const EventEmitter = require('events');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Group = require('./models/base/group');
const Auth = require('./models/base/auth');
const User = require('./models/user/index');

const collections = require('./utils/collections')

const logger = require('./logger');

class ServerEvents extends EventEmitter {}

const serverEvents = new ServerEvents();

const path = require('path');

const models = collections(path.join(__dirname, 'models'));


/**
 * definis les authorisations de l'utilisateur
 * definis le groupe user
 */
async function createDefaultUserGroup() {
    try {
        // Vérifiez si le groupe 'user' existe déjà
        Group
            .findOne({ name: 'user' })
            .then(group => {
                if (group) {
                    logger.info('User group already exists');
                    return;
                }

                // definis les authorisations de l'utilisateur
                const auths = models.map(model => ({
                    entity: model,
                    access: 'rwx'
                }));

                 Auth
                    .insertMany(auths)
                    .then(insertedAuths => {
                        // Créez le groupe 'user'
                        const newGroup = new Group({
                            name: 'user',
                            auths: insertedAuths.map(auth => auth._id),
                        });

                        newGroup
                            .save()
                            .then(() => {
                                logger.info('User group successfully created');
                            })
                            .catch(err => {
                                logger.error('Error creating User group:', err);
                                console.error('Error creating User group:', err);
                            });
                    })
                    .catch(err => {
                        logger.error('Error creating User group:', err);
                        console.error('Error creating User group:', err);
                    });
            })
            .catch(err => {
                logger.error('Error creating User group:', err);
                console.error('Error creating User group:', err);
            });
    } catch (err) {
        logger.error('Error creating User group:', err);
        console.error('Error creating User group:', err);
    }
}


/**
 * definis les authorisations de l'utilisateur super
 * definis le groupe superUser
 * creer l'utilisateur super
 */
async function createSuperUser() {
    try {
        // Vérifiez les variables d'environnement requises
        if (
            !process.env.SUPER_USER_EMAIL 
            || !process.env.SUPER_USER_PASSWORD 
            || !process.env.SUPER_USER_PHONE
            || !process.env.SUPER_USER_NAME
        ) {
            throw new Error('Super user environment variables are not properly defined');
        }

        // verifier si un super User exist
        User
            .findOne({ username: process.env.SUPER_USER_NAME })
            .then(user => {
                if (user) {
                    return;
                }

                // verifier l'existence du group superUser
                Group
                    .findOne({ name: 'superUser' })
                    .then(group => {
                        if (!group) {
                            const auths = models.map(model => ({
                                entity: model,
                                access: 'rwx'
                            }));

                            Auth
                                .insertMany(auths)
                                .then(insertedAuths => {
                                    const newGroup = new Group({
                                        name: 'superUser',
                                        auths: insertedAuths.map(auth => auth._id),
                                    });

                                    newGroup
                                        .save()
                                        .then()
                                        .catch(err => {
                                            logger.error('Error creating SuperUser:', err);
                                            console.error('Error creating SuperUser:', err);
                                        });
                                })
                                .catch(err => {
                                    logger.error('Error creating SuperUser:', err);
                                    console.error('Error creating SuperUser:', err);
                                });
                        }

                        bcrypt
                            .hash(process.env.SUPER_USER_PASSWORD, 10)
                            .then(hash => {
                                const user = new User({
                                    username: process.env.SUPER_USER_NAME,
                                    email: {
                                        value: process.env.SUPER_USER_EMAIL,
                                        isPublic: true
                                    },
                                    password: hash,
                                    phone: {
                                        value: process.env.SUPER_USER_PHONE,
                                        isPublic: true
                                    },
                                    staff: true,
                                    group: group._id,
                                });

                                user
                                    .save()
                                    .then(() => {
                                        logger.info('SuperUser and group successfully created');
                                    })
                                    .catch(err => {
                                        logger.error('Error creating SuperUser:', err);
                                        console.error('Error creating SuperUser:', err);
                                    });
                            })
                            .catch(err => {
                                logger.error('Error creating SuperUser:', err);
                                console.error('Error creating SuperUser:', err);
                            });
                    })
                    .catch(err => {
                        logger.error('Error creating SuperUser:', err);
                        console.error('Error creating SuperUser:', err);
                    });
            })
            .catch(err => {
                logger.error('Error creating SuperUser:', err);
                console.error('Error creating SuperUser:', err);
            });
            
    } catch (err) {
        logger.error('Error creating SuperUser:', err);
        console.error('Error creating SuperUser:', err);
    }
}


module.exports = {
    serverEvents,
    createSuperUser,
    createDefaultUserGroup,
    models
};
