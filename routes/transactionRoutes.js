const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactionController')
const authController =require('../controllers/authController')

router.use(authController.protect)

router
.route('/')
.get(transactionController.getAllTransactions)




module.exports = router
