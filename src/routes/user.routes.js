const router = require("express").Router();

const { register, updateProfile, getUser } = require("../controllers/user.controller")


router.post("/register", register)
router.patch("/updateProfile/:id", updateProfile)
router.get("/getUser", getUser)

module.exports = router