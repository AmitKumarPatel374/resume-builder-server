const UserModel = require("../models/User.model")
const cacheInstance = require("../services/cache.service")
const { getClearCookieOptions } = require("../utils/cookie.utils")

const registerController = async (req, res) => {
  try {
    let { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(404).json({
        message: "All fields are required",
      })
    }

    let existingUser = await UserModel.findOne({ email })

    if (existingUser)
      return res.status(422).json({
        message: "User already exists",
      })

    let newUser = await UserModel.create({
      name,
      email,
      password,
    })

    const token = newUser.generateToken()
    // ✅ SET COOKIE
    res.cookie("token", token, {
      httpOnly: true, // cannot access via JS (security)
      secure: true, // true in production (HTTPS)
      sameSite: "none",
      maxAge: 60 * 60 * 1000, // 1 hour
    })

    return res.status(201).json({
      message: "user registered",
      token: token,
      user: newUser,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const loginController = async (req, res) => {
  try {
    let { email, password } = req.body

    if (!email || !password) {
      return res.status(404).json({
        message: "All fields are required",
      })
    }

    const user = await UserModel.findOne({ email })

    if (!user)
      return res.status(404).json({
        message: "User not found",
      })

    let cp = await user.comparePass(password)

    if (!cp)
      return res.status(400).json({
        message: "Invalid credentials",
      })

    const token = user.generateToken()

    // ✅ SET COOKIE
    res.cookie("token", token, {
      httpOnly: true, // cannot access via JS (security)
      secure: true, // true in production (HTTPS)
      sameSite: "none",
      maxAge: 60 * 60 * 1000, // 1 hour
    })
    // // Generate 6-digit OTP
    // const otp = Math.floor(100000 + Math.random() * 900000).toString()
    // const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // user.otp = otp
    // user.otpExpiry = otpExpiry
    // await user.save()

    // let verifyTemp = otpVerifyTemp(user.username, otp)

    // if (isEmail) {
    //   await sendMail(contact, "Verify Your Email", verifyTemp)
    // } else {
    //   await sendSMS(`+91${contact}`, `Your OTP is ${otp}`)
    // }

    return res.status(200).json({
      message: "user login successfully!",
      token: token,
      user: user,
    })
  } catch (error) {
    console.log("error in login->", error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const getUserById = async (req, res) => {
  try {
    const user = req.user

    return res.status(200).json({
      message: "user fetched successfully!",
      user,
    })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

const logoutController = async (req, res) => {
  try {
    let token = req.cookies.token

    if (!token) {
      return res.status(404).json({
        message: "token not found",
      })
    }

    await cacheInstance.set(token, "blacklisted")

    res.clearCookie("token", getClearCookieOptions())

    return res.status(200).json({
      message: "user logged out successfully!",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const countUserController = async (req, res) => {
  try {
    const userCount = await UserModel.countDocuments()

    return res.status(200).json({
      userCount,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

module.exports = {
  registerController,
  loginController,
  getUserById,
  logoutController,
  countUserController
}
