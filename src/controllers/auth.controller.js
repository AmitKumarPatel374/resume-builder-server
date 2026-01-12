import UserModel from "../models/User.model.js"
import cacheInstance from "../services/cache.service.js"
import { getClearCookieOptions } from "../utils/cookie.utils.js"
import { emailQueue } from "../queues/emailQueue.js"
import TempUser from "../models/tempUser.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const registerController = async (req, res) => {
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    const hashedPassword = await bcrypt.hash(password, 10)

    //ye resend email ke liye bhi use hoga if email new then it will create new
    await TempUser.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry,
      },
      { upsert: true }
    )

    await emailQueue.add("verify-email", {
      email,
      otp,
      otpExpiry,
    })

    return res.status(200).json({
      message: "OTP sent to your email. please verify!",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

export const verifyEmailController = async (req, res) => {
  try {
    const { email, otp } = req.body

    const tempUser = await TempUser.findOne({ email })
    if (!tempUser) {
      return res.status(400).json({ message: "OTP expired" })
    }

    if (tempUser.otpExpiry < Date.now()) {
      await TempUser.deleteOne({ email })
      return res.status(400).json({ message: "OTP expired" })
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    const newUser = await UserModel.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      isEmailVerified: true,
    })

    const token = newUser.generateToken()
    // ✅ SET COOKIE
    res.cookie("token", token, {
      httpOnly: true, // cannot access via JS (security)
      secure: true, // true in production (HTTPS)
      sameSite: "none",
      maxAge: 60 * 60 * 1000, // 1 hour
    })

    await TempUser.deleteOne({ email })

    // ✅ SEND WELCOME EMAIL (IMPORTANT)
    await emailQueue.add("welcome-email", {
      name: newUser.name,
      email: newUser.email,
    })

    return res.status(201).json({
      message: "user registered successfully!",
      token: token,
      user:newUser,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

export const resendOTPController = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    // check temp user exists
    const tempUser = await TempUser.findOne({ email })

    if (!tempUser) {
      return res.status(404).json({ message: "No pending verification for this email" })
    }

    // generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = Date.now() + 5 * 60 * 1000 // 5 minutes

    // update OTP & expiry
    tempUser.otp = otp
    tempUser.otpExpiry = otpExpiry
    await tempUser.save()

    // send OTP email
    await emailQueue.add("verify-email", {
      email,
      otp,
      otpExpiry,
    })

    return res.status(200).json({
      message: "OTP resent successfully",
    })
  } catch (error) {
    console.error("Resend OTP error:", error)
    return res.status(500).json({
      message: "Failed to resend OTP",
    })
  }
}

export const loginController = async (req, res) => {
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

export const forgotPasswordController = async (req, res) => {
  try {
    let { email } = req.body

    if (!email) {
      return res.status(404).json({
        message: "email not found",
      })
    }

    let user = await UserModel.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      })
    }

    const userName = user.name;

    let resetToken = jwt.sign({ id: user._id }, process.env.JWT_RAW_SECRET, {
      expiresIn: "5min",
    })


    // Use environment variable for reset link base URL
    const baseUrl = process.env.SERVER_ORIGIN
    let resetLink = `${baseUrl}/auth/reset-password/${resetToken}`


     await emailQueue.add("forgot-link", {
      email,
      userName,
      resetLink,
    })

    return res.status(201).json({
      message: "reset link sended at your registered email!",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

export const resetPasswordController = async (req, res) => {
  try {
    let token = req.params.token
    if (!token) {
      return res.status(404).json({
        message: "token not found",
      })
    }

    let decode = jwt.verify(token, process.env.JWT_RAW_SECRET)

    return res.render("index.ejs", { id: decode.id,BASE_URL: process.env.SERVER_ORIGIN })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

export const updatePasswordController = async (req, res) => {
  try {
    let id = req.params.id
    let { password } = req.body
    if (!id) {
      return res.status(404).json({
        message: "id not found",
      })
    }

    let hashPass = await bcrypt.hash(password, 11)

    let updatedPassUser = await UserModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        password: hashPass,
      },
      {
        new: true,
      }
    )

    return res.status(200).json({
      message: "password updated successfully!",
      upadatedUser: updatedPassUser,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

export const getUserById = async (req, res) => {
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

export const logoutController = async (req, res) => {
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

export const countUserController = async (req, res) => {
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
