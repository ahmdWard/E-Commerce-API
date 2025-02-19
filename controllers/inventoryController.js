const inventory = require ('../models/InventoryModel')
const factory = require('../controllers/handlerFactory');



// @desc create an  inventories
// @route POST /api/v1/inventory
// @access Private/protect/admin-manger
exports.createInventory = factory.createOne(inventory)




// @desc Get list of inventories
// @route GET /api/v1/inventory
// @access Private/protect/admin-manger
exports.getAllInventory = factory.getAll(inventory)



// @desc Get an inventory
// @route GET /api/v1/inventory/:id
// @access Private/protect/admin-manger
exports.getInventory = factory.getOne(inventory)




// @desc update a inventory
// @route PATCH /api/v1/inventory/:id
// @access Private/protect/admin-manger
exports.updateInventory = factory.updateOne(inventory)




// @desc Delete a  inventories
// @route DELETE /api/v1/inventory/:id
// @access Private/protect/admin-manger
exports.deleteInventory = factory.deleteOne(inventory)



