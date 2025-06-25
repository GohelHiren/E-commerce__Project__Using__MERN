const { Product } = require('../Model/Product')
const jwt = require('jsonwebtoken')
const { User } = require('../Model/User')

const ShowProduct = async (req, res) => {
    try {
        const products = await Product.find({})
        return res.status(200).json({ message: "All Products", product: products })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const AddProduct = async (req, res) => {
    try {
        const { name, price, img, desc, brand, stock } = req.body

        if (!name || !price || !img || !desc || !brand || !stock) {
            return res.status(400).json({ message: "Some Fields are Missing..!" })
        }

        const isUserAlreadyExist = await Product.findOne({ name })

        if (isUserAlreadyExist) {
            return res.status(400).json({ message: "User already exist..." })
        }

        const { token } = req.headers
        const decodedToken = jwt.verify(token, "supersecret")
        const user = await User.findOne({ email: decodedToken.email })

        if (!user) {
            return res.status(401).json({ message: "Unauthorized user" })
        }

        const product = await Product.create({
            name,
            price,
            image: img,
            description: desc,
            brand,
            stock,
            user: user._id
        })

        return res.status(200).json({
            message: "Product Created Successfully...",
            product: product
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const findProduct = async (req, res) => {
    try {
        let { id } = req.params
        if (!id) {
            return res.status(400).json({ message: "Id not found...!" })
        }
        let { token } = req.headers
        let decodedToken = jwt.verify(token, "supersecret")
        const user = await User.findOne({ email: decodedToken.email })
        if (!user) {
            return res.status(401).json({ message: "Unauthorized user" })
        }
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: "Product not found...!" })
        }
        return res.status(200).json({
            message: "Product Found Successfully",
            product: product
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server error..."
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        let { id } = req.params
        const { name, price, img, desc, brand, stock } = req.body
        if (!id) {
            return res.status(400).json({ message: "Id not found...!" })
        }
        let { token } = req.headers
        let decodedToken = jwt.verify(token, "supersecret")
        let user = await User.findOne({ email: decodedToken.email })
        if (!user) {
            return res.status(401).json({ message: "Unauthorized user" })
        }
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: "Product not found...!" })
        }
        let updateProObj = { name, price, img, desc, brand, stock }
        let updatePro = await Product.findByIdAndUpdate({ _id: id }, { $set: updateProObj })
        return res.status(200).json({
            message: "Product Updated Successfully...",
            product: updatePro
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server error..."
        })
    }
}

const deleteProduct = async (req, res) => {

    try {
        let { id } = req.params
        let { token } = req.headers
        let decodedToken = jwt.verify(token, "supersecret")
        let user = await User.findOne({ email: decodedToken.email })

        if (!id) {
            return res.status(400).json({ message: "Id not found...!" })
        }

        if (!user) {
            return res.status(401).json({ message: "Unauthorized user" })
        }

        let delproduct = await Product.deleteOne({ _id: id })

        return res.status(200).json({
            message: "Product Updated Successfully...",
            product: delproduct
        })



    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server error..."
        })
    }

}

module.exports = { ShowProduct, AddProduct, findProduct, updateProduct, deleteProduct }