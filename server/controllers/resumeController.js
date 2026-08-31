import User from "../models/User.js";

export const uploadResume = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    console.log(req.file);
    // Get logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Save resume path
    user.resume = req.file.path;

    // Job description is optional — sent alongside the file as a
    // regular form field (multer puts non-file fields on req.body)
    if (typeof req.body.jobDescription === "string") {
      user.jobDescription = req.body.jobDescription.trim();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: user.resume,
      jobDescription: user.jobDescription,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};