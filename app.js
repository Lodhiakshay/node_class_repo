const express = require('express')
const mongooseConnect = require('./src/db/dbConnection')
const bodyParser = require('body-parser')
const cors = require("cors")
const app = express()

app.get('/', function(req, res) {
    res.send('Hello World, Node js')
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())

mongooseConnect()

// import routes
const userRoutes = require("./src/routes/user.routes")
app.use(userRoutes) // pre defined route

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log("Server is running on: http://localhost:3000")
})