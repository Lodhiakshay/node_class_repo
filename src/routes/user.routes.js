const router = require("express").Router();
const { userAuthAuthenticated } = require("../middlewares/auth.middleware")
const { register, updateProfile, getUser, verifyOtp, login, deleteUser } = require("../controllers/user.controller")

router.post("/register", register)
router.patch("/updateProfile/:id", updateProfile)
router.get("/getUser", userAuthAuthenticated, getUser)
router.post("/verifyOtp", verifyOtp)
router.post("/login", login)
router.delete("/deleteUser/:_id", deleteUser)

module.exports = router