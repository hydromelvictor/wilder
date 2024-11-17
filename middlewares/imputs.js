const joi = require('joi')

const validateUser = joi.object({
    email: joi.string().trim().email().required(),
    password: joi.string().trim().min(6).max(30).required()
})

exports.validatedUser = (req, res, next) => {
    const {error, value } = validateUser.validate(req.body)
    if (error) return res.status(422).json({ msg: 'Email ou Password invalid !!!'})
    else next()
}
