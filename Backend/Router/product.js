const express = require('express')
const { ShowProduct, AddProduct, findProduct, updateProduct, deleteProduct } = require('../Controller/product.controller')
const router = express.Router()

// get product
router.get('/get-product', ShowProduct)

// add product 
router.post('/add-product', AddProduct)

//find-product
router.get('/find-product/:id', findProduct)

//update-product
router.put('/update-product/:id', updateProduct)

//delete-product
router.delete('/delete-product/:id', deleteProduct)

module.exports = router

