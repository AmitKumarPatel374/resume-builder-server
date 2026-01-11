import feedbackModel from "../models/feedback.model.js"
import { emailQueue } from "../queues/emailQueue.js";

export const addFeedbackController = async (req, res) => {
  try {
    const { name, email, role, message, rating, source } = req.body

    // 1. Basic validation
    if (!name || !email || !role || !message || !rating) {
      return res.status(400).json({
        message: "All required fields must be filled",
      })
    }

    // 2. Rating validation
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      })
    }

    // 3. Check if feedback already exists (ONE feedback per user)
    const existingFeedback = await feedbackModel.findOne({ email })

    if (existingFeedback) {
      return res.status(400).json({
        message: "You have already submitted feedback",
      })
    }

    // 4. Create feedback
    const newFeedback = await feedbackModel.create({
      name,
      email,
      role,
      message,
      rating,
      source: source || "dashboard",
    })

    await emailQueue.add("thanks-feedback", {
      email
    })

    // 5. Success response
    return res.status(201).json({
      message: "Feedback submitted successfully , Thanks!",
      feedback: newFeedback,
    })
  } catch (error) {
    console.error("Add feedback error:", error)

    return res.status(500).json({
      message: "Internal server error",
    })
  }
}

export const getAllFeedbackController = async (req, res) => {
  try {
    const feedbacks = await feedbackModel.find().sort({ createdAt: -1 })

    return res.status(200).json({
      message: "Feedback fetched successfully",
      total: feedbacks.length,
      feedbacks,
    })
  } catch (error) {
    console.error("Get feedback error:", error)

    return res.status(500).json({
      message: "Internal server error",
    })
  }
}

// export const sendThanksFeedbackEmailController = async (req, res) => {
//   try {
//     const user = req.user

//     await emailQueue.add("thanks-feedback", {
//       email,
//     })
//   } catch (error) {}
// }
