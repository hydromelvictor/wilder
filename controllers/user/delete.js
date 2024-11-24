


exports.deleteAllUsers = (req, res, next) => {
    User
        .deleteMany()
        .then(() => res.status(204).json())
        .catch(err => {
            logger.error(err)
            return res.status(500).json({ 
                msg: 'error',
                err: err.message
            })
        })
}


exports.deleteSearchedUsers = (req, res, next) => {
    const { search } = req.body

    User
        .deleteMany({ $text: { $search: search } })
        .then(() => res.status(204).json())
        .catch(err => {
            logger.error(err)
            return res.status(500).json({ 
                msg: 'error',
                err: err.message
            })
        })
}


exports.deleteUsers = (req, res, next) => {
    const { users } = req.body

    User
        .deleteMany({ _id: { $in: users } })
        .then(() => res.status(204).json())
        .catch(err => {
            logger.error(err)
            return res.status(500).json({ 
                msg: 'error',
                err: err.message
            })
        })
}
