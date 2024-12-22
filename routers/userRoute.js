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
.route('/forgetpassword')
.post(authController.forgetPassword)


router
.route("/resetpassword/:token")
.post(authController.resetpassword)

router.use(authController.protect)

router
.route('/updateMe')
.patch(userController.updateMe)

router
.route('/changepassword')
.post(userController.changePassword)

router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUser)

router
.route('/:id')
.get(userController.getUser)
.delete(userController.deleteUser)

module.exports = router