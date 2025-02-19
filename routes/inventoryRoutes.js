const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const inventoryController  = require('../controllers/inventoryController')

router.use(authController.protect,authController.restrictTo('admin'))

router
.route('/')
.get(inventoryController.getAllInventory)
.post(inventoryController.createInventory)

router
.route('/:id')
.get(inventoryController.getInventory)
.patch(inventoryController.updateInventory)
.delete(inventoryController.deleteInventory)


module.exports = router