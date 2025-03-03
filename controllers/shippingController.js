const factory = require ('../controllers/handlerFactory')
const Shipping = require('../models/shippingModel')

// @desc  Get list of Shipments
// @route GET /api/v1/shipping
// @access private/admin

exports.getAllshipping = factory.getAll(Shipping)

