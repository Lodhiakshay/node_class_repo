const User = require("../models/user.model")
const { sendOtpByEmail, generateOTP } = require("../utils/sendEmail")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")

const register = async(req, res) => {

    try {
        // data from req.body
        let { firstName, lastName, email, mobile, password } = req.body

        // has password

        const hasPassword = await bcrypt.hash(password, 10)


        // generate 6 digit otp
        const otp = generateOTP()

        // insert data or entry in database
        const userData = await User.create({
                firstName,
                lastName,
                email,
                mobile,
                otp,
                password: hasPassword
            })
            // send response
        if (!userData) {
            return res.status(400).json({
                status: false,
                message: "User not created"
            })
        }

        // Send otp on email
        sendOtpByEmail(email, otp)

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

const verifyOtp = async(req, res) => {
    try {
        const { email, otp } = req.body

        const existUser = await User.findOne({ email })

        if (existUser) {
            if (existUser.otp === otp) {
                existUser.isRegisterd = true
                await existUser.save()

                return res.status(200).json({
                    status: true,
                    message: "Otp verified successfully",
                })
            }
            return res.status(400).json({
                status: false,
                message: "Wrong OTP",
            })
        }
        return res.status(400).json({
            status: false,
            message: "User does not exist",
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

const login = async(req, res) => {
    try {
        const { email, password } = req.body

        // check exist User with given email
        const existUser = await User.findOne({
            email
        })

        if (!existUser) {
            return res.status(400).json({
                status: false,
                message: "User not registerd"
            })
        } else if (!existUser.isRegisterd) {
            return res.status(400).json({
                status: false,
                message: "Please verify your OTP and complete your signup"
            })
        }

        // math the password
        const isPasswordMatch = await bcrypt.compare(password, existUser.password)

        if (!isPasswordMatch) {
            return res.status(400).json({
                status: false,
                message: "Please enter correct password"
            })
        }

        const payload = {
            _id: existUser._id,
            email: existUser.email,
        }

        // generate token
        const jwtToken = jwt.sign(payload, "hgjhdyxtiuy8e7tiuwqguer2yte912")

        return res.status(200).json({
            status: true,
            message: "Logged in successfully",
            data: existUser,
            token: jwtToken
        })


    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

const deleteUser = async(req, res) => {
    try {
        const { _id } = req.params

        if (!_id) {
            return res.status(400).json({
                status: false,
                message: "Id is required"
            })
        }

        const deletedUser = await User.findByIdAndDelete(_id)

        if (!deletedUser) {
            return res.status(400).json({
                status: false,
                message: "User not found with this id"
            })
        }

        return res.status(200).json({
            status: true,
            message: "User deleted successfully",
            data: deleteUser
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

module.exports = { register, updateProfile, getUser, verifyOtp, login, deleteUser }