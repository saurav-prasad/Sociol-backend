const express = require('express')
const { body, validationResult } = require('express-validator')
const userSchema = require('../schema/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const fetchUser = require('../middleware/fetchUser');
const profileSchema = require('../schema/profile')
require('dotenv').config()

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

// Route 1: Create a user- POST => /auth/createuser

router.post('/createuser',
    // request body validation
    [body('email', 'Enter a valid email').isEmail(),
    body('username', 'Username should be atleast of 3 characters long').isLength({ min: 3 }),
    body('password', "Password should be atleast of 6 characters long").isLength({ min: 6 })],

    async (req, res) => {
        let success;
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            success = false
            return res.send({ success, message: errors.array()[0].msg })
        }
        try {
            const { password, email, username, phone } = req.body

            // checking the username
            let user = await userSchema.findOne({ username })

            if (user) {
                success = false
                return res.send({ success, message: "Username already taken" })
            }
            // checking the email
            user = await userSchema.findOne({ email })
            if (user) {
                success = false
                return res.send({ success, message: "Email already exist" })
            }

            // hashing password
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)

            // adding the user to database
            user = await userSchema.create({
                username,
                password: hashPassword,
                email,
                phone
            })
            await profileSchema.create({
                username,
                email,
                phone,
                userId: user.id,
                profilePhoto: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`,
            })
            // token generation
            const token = jwt.sign({
                userId: user.id
            }, JWT_SECRET)

            success = true
            res.send({
                success,
                data: {
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user?.phone
                },
                token, message: "User created successfully"
            })

        } catch (error) {
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    }
)

// Route 2: Signin user- POST => /auth/getuser

router.post('/getuser',
    [body('email', "Enter a valid email").isEmail(),
    body('password', "Password should be atleast of 6 characters long").isLength({ min: 6 })],
    async (req, res) => {
        let success;

        // checking body data
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            success = false
            return res.status(400).send({ success, message: errors.array()[0].msg })
        }
        try {
            const { email, password } = req.body

            // check the user with email
            const user = await userSchema.findOne({ email })
            if (!user) {
                success = false
                return res.send({ success, message: "Either email or password incorrect" })
            }

            //  check password
            const matchPassword = await bcrypt.compare(password, user.password)

            if (!matchPassword) {
                success = false
                return res.send({ success, message: "Either email or password incorrect" })
            }

            success = true

            // token generation
            const token = jwt.sign({
                userId: user.id
            }, JWT_SECRET)

            res.send({
                success, message: "User authenticated", token,
                data: {
                    name: user.name,
                    userId: user.id,
                    email: user.email,
                    phone: user?.phone
                }
            })
        } catch (err) {
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    }

)

// Route 3 : fetch user- POST => /auth/fetchuser

router.post('/fetchuser', fetchUser,
    async (req, res) => {
        try {
            let success

            // checking if the user exist
            const user = await userSchema.findById(req.userId).select('-password')
            if (!user) {
                success = false
                return res.status(400).send({ success, message: "Something went wrong" })
            }
            success = true
            res.send({ success, message: "User fetched", data: user })
        } catch (error) {
            success = false
            res.send(500).send({ success, message: "Internal server error occurred" })
        }
    }
)

module.exports = router