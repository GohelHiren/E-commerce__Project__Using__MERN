const jwt = require('jsonwebtoken')
const { User } = require('../Model/User')
const { Product } = require('../Model/Product')

const cart = async (req, res) => {
    try {
        const { token } = req.headers
        const decodedToken = jwt.verify(token, "supersecret")
        const user = await User.findOne({ email: decodedToken.email }).populate({
            path: 'cart',
            populate: {
                path: 'products',
                model: 'Product'
            }
        })

        if (!user) {
            res.status(400).json({
                message: "User Not Found"
            })


            res.status(200).json({
                message: "Cart created Successfully",
                cart: User.cart
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" })
    }
}