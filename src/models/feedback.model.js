const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true, // e.g. Student, Fresher, Developer
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // approved: {
    //   type: Boolean,
    //   default: false, // only approved feedback shows in testimonials
    // },

    source: {
      type: String,
      enum: ["dashboard", "landing"],
      default: "dashboard",
    },
  },
  { timestamps: true }
)

const feedbackModel = mongoose.model("Feedback", feedbackSchema)

module.exports = feedbackModel
