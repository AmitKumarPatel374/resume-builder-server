const express = require("express")
const {
  registerController,
  loginController,
  getUserById,
  logoutController,
  countUserController,
} = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router()

router.post("/register", registerController)
router.post("/login", loginController)
router.get("/data", authMiddleware, getUserById)
router.delete("/logout", authMiddleware, logoutController)
router.get("/user/count", authMiddleware, countUserController)

module.exports = router
