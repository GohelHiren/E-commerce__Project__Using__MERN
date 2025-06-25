const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { Cart } = require('../Model/Cart')

//route to get cart
router.get('/userCart', Cart)

module.exports = router