const resumeModel = require("../models/resume.model")
const ai = require("../services/ai.service")

const enhanceProfessionalSummaryController = async (req, res) => {
  try {
    const { userContent } = req.body
    if (!userContent) {
      return res.status(400).json({
        message: "missing content!",
      })
    }

    console.log("OPENAI KEY EXISTS:", !!process.env.OPENAI_API_KEY)
    console.log("MODEL:", process.env.OPENAI_MODEL)

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1–2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly, and only return text—no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    })

    const enhancedContent = response.choices[0].message.content

    return res.status(200).json({
      message: "enhanced professional summary",
      enhancedContent,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const enhanceJobDescriptionController = async (req, res) => {
  try {
    const { userContent } = req.body
    if (!userContent) {
      return res.status(400).json({
        message: "missing content!",
      })
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only 1–2 sentences, highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly, and only return text—no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    })

    const enhancedContent = response.choices[0].message.content

    return res.status(200).json({
      message: "enhanced Job Description",
      enhancedContent,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

function extractJson(text) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim()

  return JSON.parse(cleaned)
}

const uploadResumeController = async (req, res) => {
  try {
    const { resumeText, title } = req.body
    const user = req.user
    const userId = user._id

    if (!resumeText) {
      return res.status(400).json({
        message: "missing content!",
      })
    }

    const systemPrompt = "You are an expert AI Agent to extract data from resume."

    const userPrompt = `extract data from this resume: ${resumeText}

    Provide data in the following JSON format with no additional text before or after:

    {
    professional_summary: {
      type: String,
      default: "",
    },

    skills:[{type:String}],

    personal_info: {
      image: {
        type: String,
        default: "",
      },
      full_name: {
        type: String,
        default: "",
      },
      profession: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      location: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },

    experience: [
      {
        company: {
          type: String,
          default: "",
        },
        position: {
          type: String,
          default: "",
        },
        start_date: {
          type: String,
          default: "",
        },
        end_date: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
        is_current: {
          type: Boolean,
          default: false,
        },
      },
    ],

    projects: [
      {
        name: {
          type: String,
          default: "",
        },
        type: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],

    education: [
      {
        institution: {
          type: String,
          default: "",
        },
        degree: {
          type: String,
          default: "",
        },
        field: {
          type: String,
          default: "",
        },
        graduation_date: {
          type: String,
          default: "",
        },
        gpa: {
          type: String,
          default: "",
        },
      },
    ],
    }
    `

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      // response_formate: { type: "json_object" },
    })

    const extractedData = response.choices[0].message.content

    const parsedData = extractJson(extractedData)

    const newResume = await resumeModel.create({ userId, title, ...parsedData })

    return res.status(200).json({
      message: "data extracted from resume and created new",
      resumeId: newResume._id,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const enhanceFeedbackMessageController = async (req, res) => {
  try {
    const { userContent } = req.body

    if (!userContent) {
      return res.status(400).json({
        message: "Missing content!",
      })
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Improve the given feedback message by rewriting it into one clear, professional sentence that reflects the user’s experience and rating tone, and highlights key benefits. Return only the improved text.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    })

    const enhancedContent = response.choices[0].message.content

    return res.status(200).json({
      message: "Feedback enhanced successfully",
      enhancedContent,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: "Internal server error",
    })
  }
}


module.exports = {
  enhanceProfessionalSummaryController,
  enhanceJobDescriptionController,
  uploadResumeController,
  enhanceFeedbackMessageController,
}
