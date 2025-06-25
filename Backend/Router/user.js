const express = require('express')
const { signUp, logIn } = require('../Controller/user.controller')
const router = express.Router()

// Signup route
router.post('/register', signUp)

// Login route
router.post('/login', logIn)

module.exports = router