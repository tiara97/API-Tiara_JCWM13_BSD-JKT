const router = require('express').Router()
const {userController} = require('../controllers')
const {validator} = require('../helper/validator')

router.post('/user/login', userController.login)
router.post('/user/register', validator, userController.register)
router.get('/user/active/:id', userController.activate)
router.get('/user/deactive/:id', userController.deactivate)
router.get('/user/close/:id', userController.close)

module.exports = router