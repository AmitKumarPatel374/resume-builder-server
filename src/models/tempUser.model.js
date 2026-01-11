import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  otp: String,
  otpExpiry: Date,
});

export default mongoose.model("TempUser", tempUserSchema);
