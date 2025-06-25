const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    description: {
        type: String
    },
    brand: {
        type: String
    },
    stock: {
        type: Number
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
})


const Product = mongoose.model('product', ProductSchema)
module.exports = { Product }