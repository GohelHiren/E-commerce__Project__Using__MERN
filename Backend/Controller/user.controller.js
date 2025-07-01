const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../model/User')

const signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body
        if (!username || !email || !password) {
            res.status(400).json({ message: "Some Fields are Missing..!" })
        }

        const isUserAlreadyExist = await User.findOne({ email })

        if (isUserAlreadyExist) {
            return res.status(400).json({ message: `${username} already exist...` })
        }

        // hash the password 
        const salt = bcrypt.genSaltSync(10)
        const passwordHased = bcrypt.hashSync(password, salt)

        // JWT token
        const token = jwt.sign({ email }, "supersecret", { expiresIn: "365d" })

        await User.create({
            username,
            email,
            password: passwordHased,
            token,
            role: 'user'
        })
        res.status(200).json({ message: `${username} Your Signup Successfully!!` })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }

}

const logIn = async (req, res) => {
    try {
        let { email, password } = req.body
        if (!email || !password) {

            return res.status(400).json({ message: "Some Fields are Missing..!" })
        }

        let user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({ message: "User not Register!! :(" })
        }

        // compare password

        let isPasswordMatched = bcrypt.compareSync(password, user.password)
        if (!isPasswordMatched) {
            res.status(400).json({ message: "password wrong!! :(" })
        }

        res.status(200).json({
            message: `You are Login successfully ${ user.email} :)`,
            id: user._id,
            username: user.Username,
            token: user.token,
            email: user.email,
            role: user.role
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { signUp, logIn }