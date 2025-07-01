require('dotenv').config();
const Stripe = require('stripe');
const jwt = require('jsonwebtoken')
const { Cart } = require('../model/Cart')
const { User } = require('../model/User')
const { Product } = require('../model/Product')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const sendEmail = require('../Utils/userEmail')


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
            res.status(400).json({ message: "user not found" })
        }
        res.status(200).json({
            message: `${user.username} Your cart Data :)`,
            cart: user.cart

        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}


// new logic for add to cart

const addToCart = async (req, res) => {
    try {

        const { quantity, productID } = req.body
        if (!quantity || !productID) {
            return res.status(400).json({ message: "Product Or Quantity is missing!!" })
        }

        const { token } = req.headers
        let decodedToken = jwt.verify(token, "supersecret")

        let user = await User.findOne({ email: decodedToken.email })
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        const product = await Product.findById(productID)
        if (!product) { return res.status(400).json({ message: "Product not found" }) }

        let cart;

        if (user.cart) {
            cart = await Cart.findById(user.cart)

            //if cart is not found even though user has cart ID

            if (!cart) {
                cart = await Cart.create({
                    products: [{ product: productID, quantity }],
                    total: product.price * quantity,
                })

                user.cart = cart._id
                await user.save()
            } else {
                const exists = cart.products.some(
                    (p) => p.product.toString() === productID.toString()
                )

                if (exists) {
                    return res.status(409).json({ message: "Go To Cart" })

                }
                cart.products.push({ product: productID, quantity })
                cart.total += product.price * quantity
                await cart.save()
            }
        } else {
            // First Time Cart Creation

            cart = await Cart.create({
                products: [{ product: productID, quantity }],
                total: product.price * quantity,
            })

            user.cart = cart._id
            await user.save()
        }

        res.status(200).json({ message: "Product Added to cart" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })

    }
}


const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body
        const { token } = req.headers



        if (!token) {
            return res.status(401).json({ message: "Token is required" })
        }

        const decodedToken = jwt.verify(token, "supersecret")
        const user = await User.findOne({ email: decodedToken.email }).populate({
            path: "cart",
            populate: {
                path: "products.product",
                model: "product"
            }
        })

        if (!user || !user.cart) {
            return res.status(400).json({ message: "Cart not found!!" })
        }

        const cart = user.cart
        const item = cart.products.find((p) => p.product._id.toString() === productId)


        if (!item) {
            return res.status(400).json({ message: "Product not found!!" })
        }

        const totalPrice = item.product.price;

        // quantity logic
        if (quantity === "increase") {
            item.quantity += 1;
        } else if (quantity === "decrease") {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // Remove product if quantity goes below 1
                cart.products = cart.products.filter(p => p.product._id.toString() !== productId);
            }
        } else if (quantity === "remove" || quantity === 0) {
            // Remove product from cart
            cart.products = cart.products.filter(p => p.product._id.toString() !== productId);
        } else if (typeof quantity === "number" && quantity > 0) {
            // Set to a specific quantity
            item.quantity = quantity;
        } else {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        // Recalculate total after any change
        cart.total = cart.products.reduce((sum, p) => sum + (p.product.price * p.quantity), 0);

        // If cart is empty, set total to 0
        if (cart.products.length === 0) cart.total = 0;

        await cart.save();
        return res.status(200).json({ message: "Cart Updated", cart })

    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Internal server error" })
    }
}








// payment

const payment = async (req, res) => {
    try {
        const { token } = req.headers
        const decodedToken = jwt.verify(token, "supersecret")

        const user = await User.findOne({ email: decodedToken.email }).populate({
            path: 'cart',
            populate: {
                path: 'products.product',
                model: 'product'
            }
        })

        if (!user || !user.cart || user.cart.products.length === 0) {
            res.status(404).json({ message: "user or cart not found" })
        }

        //payment code 
        const lineItems = user.cart.products.map((item, index) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.product.name
                },
                unit_amount: item.product.price * 100,
            },
            quantity: item.quantity
        }))

        const curentURL = process.env.CLIENT_URL

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${curentURL}/success`,
            cancel_url: `${curentURL}/cancel`
        })

        await sendEmail(
            user.email,
            user.cart.products.map((item, index) =>
            (
                {
                   
                    name: item.product.name,
                    price: item.product.price
                }))
        )


        //empty cart 
        user.cart.products = []
        user.cart.total = 0
        await user.cart.save()
        await user.save()

        res.status(200).json({
            message: "get the payment",
            url: session.url
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}



module.exports = { cart, addToCart, updateCart, payment }