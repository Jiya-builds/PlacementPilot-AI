import fs from "fs/promises";
import User from "../models/User.js";
import { extractPDFText } from "../utils/extractPDFText.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // memoryStorage ho to buffer milega, warna disk se padho
    const buffer = req.file.buffer || (await fs.readFile(req.file.path));

    const text = await extractPDFText(buffer);

    if (!text || text.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message:
          "Could not read text from this PDF. Please upload a text-based PDF (not a scanned image).",
      });
    }

    user.resume = req.file.originalname;
    user.resumeText = text.slice(0, 20000);

    await user.save();

    // disk pe file bani thi to saaf kar do
    if (req.file.path) {
      fs.unlink(req.file.path).catch(() => {});
    }

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: user.resume,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};