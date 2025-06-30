const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { cart, addToCart, updateCart, payment } = require('../Controller/cart.controller')

// route to get cart 
router.get('/cart', cart)

// route to add to cart
router.post('/addToCart', addToCart)

//router update cart
router.put('/updateCart', updateCart)

//router Payment
router.post('/payment', payment)

module.exports = router