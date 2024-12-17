const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { route } = require('../app')


router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUser)

router
.route('/:id')
.get(userController.getUser)

module.exports = router