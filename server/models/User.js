import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    technologies: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    shortTerm: {
      type: [String],
      default: [],
    },
    midTerm: {
      type: [String],
      default: [],
    },
    longTerm: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const jobMatchSchema = new mongoose.Schema(
  {
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingForJob: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    resumeScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    suggestedProjects: {
      type: [projectSchema],
      default: [],
    },

    interviewQuestions: {
      type: [String],
      default: [],
    },

    roadmap: {
      type: roadmapSchema,
      default: () => ({
        shortTerm: [],
        midTerm: [],
        longTerm: [],
      }),
    },

    jobMatch: {
      type: jobMatchSchema,
      default: null,
    },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      default: "",
    },

    answer: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    feedback: {
      type: String,
      default: "",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    college: {
      type: String,
      default: "",
    },

    branch: {
      type: String,
      default: "",
    },

    cgpa: {
      type: Number,
      default: 0,
    },

    graduationYear: {
      type: Number,
      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    leetcode: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    jobDescription: {
      type: String,
      default: "",
    },

    analysis: {
      type: analysisSchema,
      default: null,
    },

    interviews: {
      type: [interviewSchema],
      default: [],
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;