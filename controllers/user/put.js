require('dotenv').config();

const User = require('../../models/user/index');
const logger = require('../../logger');
const action = require('../../utils/action');



exports.criticalUpdate = (req, res, next) => {
    /**
     * isAuthenticated
     * online
     * status
     */

    const { user } = req.auth;
    const { id } = req.params;

    if (!user || !id) {
        return res.status(400).json({ msg: 'User not found' })
    }

    const actioner = action(user, 'user')

    if (!actioner.group.isWrite || !user.staff) {
        return res.status(403).json({ msg: 'You do not have permission to read user' })
    }
    
    User
        .findOne({ _id: id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ msg: 'user not found' })
            }
            
            if (!(req.body.status in ['waiting', 'active', 'inactive', 'delete', 'suspend'])) {
                return res.status(400).json({ msg: 'status not valid' })
            }

            User
                .updateOne(
                    { _id: user._id },
                    {
                        isAuthenticated: user.isAuthenticated ? false : true,
                        online: user.online ? false : true,
                        status: req.body.status || user.status,
                    }
                )
                .then(() => res.status(200).json({
                    msg: 'user upated successfully'
                }))
                .catch(err => {
                    logger.error(err)
                    return res.status(500).json({ 
                        msg: 'error',
                        err: err.message
                    })
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
