const resumeModel = require("../models/resume.model")
const sendFilesToStorage = require("../services/storage.service")

const getUserResumesController = async (req, res) => {
  try {
    const user = req.user
    const userId = user._id

    const resumes = await resumeModel.find({ userId })

    return res.status(200).json({
      message: "resumes fetched successfully!",
      resumes,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const createResumeController = async (req, res) => {
  try {
    const user = req.user
    const userId = user._id
    const { title } = req.body

    if (!title) {
      return res.status(400).json({
        message: "title required!",
      })
    }

    const newResume = await resumeModel.create({ userId, title })

    if (!newResume) {
      return res.status(400).json({
        message: "something went wrong!",
      })
    }

    return res.status(200).json({
      message: "resume created successfully!",
      resume: newResume,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const deleteResumeController = async (req, res) => {
  try {
    const user = req.user
    const userId = user._id
    const { resumeId } = req.params

    if (!resumeId) {
      return res.status(404).json({
        message: "resumeId not found!",
      })
    }

    await resumeModel.findOneAndDelete({ userId, _id: resumeId })

    return res.status(200).json({
      message: "resume deleted successfully!",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const getUserResumeByIdController = async (req, res) => {
  try {
    const user = req.user
    const userId = user._id
    const { resumeId } = req.params

    if (!resumeId) {
      return res.status(404).json({
        message: "resumeId not found!",
      })
    }

    const resume = await resumeModel.findOne({ userId, _id: resumeId })

    if (!resume) {
      return res.status(404).json({
        message: "resume not found!",
      })
    }

    resume.__v = undefined
    resume.createdAt = undefined
    resume.updatedAt = undefined

    return res.status(200).json({
      message: "resume fetched successfully",
      resume,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const getResumeByPublicId = async (req, res) => {
  try {
    const { resumeId } = req.Params

    if (!resumeId) {
      return res.status(404).json({
        message: "resumeId not found!",
      })
    }

    const resume = await resumeModel.findOne({ public: true, _id: resumeId })

    if (!resume) {
      return res.status(404).json({
        message: "resume not found!",
      })
    }

    resume.__v = undefined
    resume.createdAt = undefined
    resume.updatedAt = undefined

    return res.status(200).json({
      message: "resume fetched successfully",
      resume,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const updateResumeController = async (req, res) => {
  try {
    const user = req.user
    const userId = user._id
    const { resumeId, resumeData, removeBackground } = req.body

    let resumeDataCopy ;
    if (typeof resumeData === 'string') {
      resumeDataCopy=  JSON.parse(resumeData)
    }else{
      resumeDataCopy=  structuredClone(resumeData)

    }

    // ✅ IF IMAGE IS SENT
    if (req.file) {
      const uploadedImage = await sendFilesToStorage(
        req.file.buffer,
        `resume_${userId}_${Date.now()}`,
        removeBackground === "true"
      );

      // ✅ SET IMAGE URL IN RESUME DATA
      resumeDataCopy.personal_info = {
        ...resumeDataCopy.personal_info,
        image: uploadedImage.url,
      };
    }

    const updatedResume = await resumeModel.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true }
    )

    if (!updatedResume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "resume updated successfully!",
      resume: updatedResume,
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
  getUserResumesController,
  createResumeController,
  deleteResumeController,
  getUserResumeByIdController,
  getResumeByPublicId,
  updateResumeController
}
