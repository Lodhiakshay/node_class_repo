const User = require("../models/user.model")
const bcrypt = require('bcryptjs');

const register = async(req, res) => {

    try {
        // data from req.body
        let { firstName, lastName, email, mobile, password } = req.body

        // has password

        const hasPassword = await bcrypt.hash(password, 10)

        // insert data or entry in database
        const userData = await User.create({
                firstName,
                lastName,
                email,
                mobile,
                password: hasPassword
            })
            // send response
        if (!userData) {
            return res.status(400).json({
                status: false,
                message: "User not created"
            })
        }
        return res.status(201).json({
            status: true,
            message: "User created successfully",
            data: userData
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

const updateProfile = async(req, res) => {
    try {

        const { id } = req.params
        let { firstName, lastName, mobile } = req.body

        const existUser = await User.findById(id)

        if (!existUser) {
            return res.status(400).json({
                status: false,
                message: "User not found with this id"
            })
        }

        const payload = {
            firstName,
            lastName,
            mobile
        }

        await User.findByIdAndUpdate(id, payload, { neqw: true })


    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
    }
}


module.exports = { register }