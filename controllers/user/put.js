



exports.criticalUpdate = (req, res, next) => {
    const userId = req.auth.otherUserId || req.auth.userId
    
    User
        .findOne({ _id: userId })
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
        })
        .catch(err => {
            logger.error(err)
            return res.status(500).json({ 
                msg: 'error',
                err: err.message
            })
        })
}