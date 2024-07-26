require("dotenv").config()
const mongoose = require("mongoose")

const mongooseConnect = async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\nMongoDB connected...`)

    } catch (error) {
        console.log("Mongodb connection failed", error)
    }
}

module.exports = mongooseConnect