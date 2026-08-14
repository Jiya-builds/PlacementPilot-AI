import mongoose from "mongoose";

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
    },

    skills: [
      {
        type: String,
      },
    ],

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
    },analysis: {
  resumeScore: {
    type: Number,
  },

  atsScore: {
    type: Number,
  },

  strengths: [
    {
      type: String,
    },
  ],

  weaknesses: [
    {
      type: String,
    },
  ],

  missingSkills: [
    {
      type: String,
    },
  ],

  suggestedProjects: [
  {
    title: { type: String },
    description: { type: String },
    technologies: [{ type: String }]
  }
],

  interviewQuestions: [
    {
      type: String,
    },
  ],

  roadmap: {
    shortTerm: [
      {
        type: String,
      },
    ],

    midTerm: [
      {
        type: String,
      },
    ],

    longTerm: [
      {
        type: String,
      },
    ],
  },
},
interviews: [
  {
    question: {
      type: String,
    },

    answer: {
      type: String,
    },

    score: {
      type: Number,
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
],

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