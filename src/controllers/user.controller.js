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

        // const { id } = req.params
        const id = req.params.id

        let { firstName, lastName, mobile, email } = req.body

        // check if user exist
        const existUser = await User.findById(id)

        // if user not exist
        if (!existUser) {
            return res.status(400).json({
                status: false,
                message: "User not found with this id"
            })
        }

        const payload = {
            firstName,
            lastName,
            email,
            mobile
        }

        // update the give fields and return new user data
        const updatedUser = await User.findByIdAndUpdate(id, payload, { new: true })

        if (!updatedUser) {
            return res.status(400).json({
                status: false,
                message: "User not updated, Bad request"
            })
        }
        return res.status(200).json({
            status: true,
            message: "User updated successfully",
            data: updatedUser
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

const getUser = async(req, res) => {
    try {

        const { id } = req.query

        if (id) {
            const user = await User.findById(id)

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "Data not found with this id"
                })
            }
            return res.status(200).json({
                status: true,
                message: "User found successfully",
                data: user
            })
        }

        const users = await User.find() //returns array of all users

        if (!users) {
            return res.status(404).json({
                status: false,
                message: "Data not found"
            })
        }
        return res.status(200).json({
            status: true,
            message: "User found successfully",
            data: users
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

module.exports = { register, updateProfile, getUser }