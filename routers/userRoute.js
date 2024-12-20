const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authController= require('../controllers/authController')



router
.route('/login')
.post(authController.login)

router
.route('/signup')
.post(authController.signUp)

router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUser)

router
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser)

module.exports = router