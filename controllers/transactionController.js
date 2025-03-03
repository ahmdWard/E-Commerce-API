const factory = require ('../controllers/handlerFactory')
const Transaction = require('../models/transactionModel')

// @desc  Get list of transactions
// @route GET /api/v1/transaction
// @access private/admin

exports.getAllTransactions = factory.getAll(Transaction)

