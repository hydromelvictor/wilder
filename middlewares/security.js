const User = require('../models/user/user');
const action = require('../utils/action');


module.exports = (req, res, next) => {
    User.findOne({ _id: req.auth.userId })
    .populate('group')
    .populate({
        path: 'group.auths',
        model: 'Auth'
    })
    .populate('level')
    .populate({
        path: 'level.performs',
        model: 'Perform'
    })
    .then(user => {
        const acts = action(user, req.auth.entity);
        /**
         * 1 - verifier si le compte est actif
         * 3 - verifier s'il a le droit de creation
         * 4 - verifier s'il a l'acreditation de creation
         */

        if (
            !acts.status.isActive || !acts.auth.isWrite || !acts.size.isBuild
        ) res.status(403).json({ msg: 'Your are not perform for this action' })

        // verifier s'il est un admin
        if (req.auth.isAdmin && !user.staff) return res.status(403).json({ 
            msg: 'Your are not perform for this action' 
        })

        next()
    })
    .catch(err => res.status(500).json({ msg: err}))
}
