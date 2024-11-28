const EventEmitter = require('events');
const mongoose = require('mongoose');
require('dotenv').config();

const Group = require('./models/base/group');
const Auth = require('./models/base/auth');
const User = require('./models/user/index');

const logger = require('./logger');

class ServerEvents extends EventEmitter {}

const serverEvents = new ServerEvents();


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
                const auths = [
                    {
                        access: 'rwx',
                        entity: 'user'
                    },
                    { entity: 'auth' },
                    { entity: 'group' }
                ]

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
        ) {
            throw new Error('Super user environment variables are not properly defined');
        }

        // Vérifiez si le groupe 'superUser' existe déjà
        Group
            .findOne({ name: 'superUser' })
            .then(group => {
                if (group) {
                    logger.info('SuperUser group already exists');
                    return;
                }

                // les collections de la base de données
                const collections = [
                    'user',
                    'auth',
                    'group',
                ]
                
                const auths = collections.map(collection => ({
                    entity: collection,
                    access: 'rwx'
                }));

                 Auth
                    .insertMany(auths)
                    .then(insertedAuths => {
                        // Créez le groupe 'superUser'
                        const newGroup = new Group({
                            name: 'superUser',
                            auths: insertedAuths.map(auth => auth._id),
                        });

                        newGroup
                            .save()
                            .then(savedGroup => {
                                // Créez le super utilisateur
                                const user = new User({
                                    username: 'admin::unknown',
                                    email: {
                                        value: process.env.SUPER_USER_EMAIL,
                                        isPublic: true
                                    },
                                    password: process.env.SUPER_USER_PASSWORD,
                                    phone: {
                                        value: process.env.SUPER_USER_PHONE,
                                        isPublic: true
                                    },
                                    staff: true,
                                    group: savedGroup._id,
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
};
