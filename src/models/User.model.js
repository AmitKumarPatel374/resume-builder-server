import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    if (!this.password.startsWith("$2b$")) {
      this.password = await bcrypt.hash(this.password, 11)
    }
  }
})

userSchema.methods.comparePass = async function (password) {
  let pass = await bcrypt.compare(password, this.password)
  return pass
}

userSchema.methods.generateToken = function () {
  let token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  })
  return token
}

const UserModel = mongoose.model("user", userSchema)

export default UserModel
