const router = require("express").Router();

const { register, updateProfile, getUser, verifyOtp, login } = require("../controllers/user.controller")

router.post("/register", register)
router.patch("/updateProfile/:id", updateProfile)
router.get("/getUser", getUser)
router.post("/verifyOtp", verifyOtp)
router.post("/login", login)

module.exports = router