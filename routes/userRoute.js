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
.post(authController.resetPassword)

router
.route("/refreshtoken")
.post(authController.refreshToken)


router
.route('/')
.post(userController.createUser)



router.use(authController.protect)




router
.route('/updateme')
.patch(userController.updateMe)

router
.route('/changepassword')
.post(authController.changePassword)

router
.route('/deleteme')
.patch(userController.deleteMe)

router
.route('/logout')
.get(authController.logOut)








router
.route('/')
.get(authController.restrictTo('admin','manager'),userController.getAllUsers)


router
.route('/:id')
.get(userController.getUser)
.delete(authController.restrictTo('admin','manager'),userController.deleteUser)

router
.route('/block/:id')
.patch(authController.restrictTo('admin','manager'),userController.block)

router
.route('/unblock/:id')
.patch(authController.restrictTo('admin','manager'),userController.unBlock)


module.exports = router