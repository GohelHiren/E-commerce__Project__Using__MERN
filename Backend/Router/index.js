const express = require('express')
const router = express.Router()
const userRoute = require('./user')
const userPro = require('./product')
const cartPro = require('./cart')

router.use('/user', userRoute)
router.use('/product', userPro)
router.use('/userCart', cartPro)

module.exports = router