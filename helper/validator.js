const {body} = require('express-validator')

const validator = [
    body('username')
    .notEmpty()
    .withMessage('username is required')
    .isLength({min: 6})
    .withMessage('username must have min 6 chars'),
    body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email is invalid'),
    body('password')
    .notEmpty()
    .withMessage('password is required')
    .matches(/[!@#$%^&*;]/)
    .withMessage('password must include special chars')
    .matches(/[0-9]/)
    .withMessage('password must include number')
    .isLength({min: 6})
    .withMessage('password must have min 6 chars')
]
module.exports = {
    validator
}