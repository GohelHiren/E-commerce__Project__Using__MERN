const express = require('express')
const router = express.Router()
const userRoute = require('./user')
const userPro = require('./product')

router.use('/user', userRoute)
router.use('/product', userPro)

module.exports = router