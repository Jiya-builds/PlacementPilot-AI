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
    },

    /* ============================================================
       RESUME ANALYSIS
       ============================================================ */

    analysis: {
      resumeScore: {
        type: Number,
        default: 0,
      },

      atsScore: {
        type: Number,
        default: null,
      },

      /* ==========================================================
         ATS DETAILS
         ========================================================== */

      atsDetails: {
        jobDescription: {
          type: String,
          default: "",
        },

        matchedSkills: [
          {
            type: String,
          },
        ],

        missingSkills: [
          {
            type: String,
          },
        ],

        matchedKeywords: [
          {
            type: String,
          },
        ],

        missingKeywords: [
          {
            type: String,
          },
        ],

        experienceMatch: {
          type: String,
          default: "",
        },

        projectMatch: {
          type: String,
          default: "",
        },

        educationMatch: {
          type: String,
          default: "",
        },

        summary: {
          type: String,
          default: "",
        },

        recommendations: [
          {
            type: String,
          },
        ],
      },

      /* ==========================================================
         RESUME INFORMATION
         ========================================================== */

      skills: [
        {
          type: String,
        },
      ],

      projects: [
        {
          type: mongoose.Schema.Types.Mixed,
        },
      ],

      experience: [
        {
          type: mongoose.Schema.Types.Mixed,
        },
      ],

      education: [
        {
          type: mongoose.Schema.Types.Mixed,
        },
      ],

      certifications: [
        {
          type: mongoose.Schema.Types.Mixed,
        },
      ],

      achievements: [
        {
          type: mongoose.Schema.Types.Mixed,
        },
      ],

      sectionsPresent: [
        {
          type: String,
        },
      ],

      measurableAchievements: {
        type: Number,
        default: 0,
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
          title: {
            type: String,
            default: "",
          },

          description: {
            type: String,
            default: "",
          },

          technologies: [
            {
              type: String,
            },
          ],
        },
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

    /* ============================================================
       INTERVIEW HISTORY
       ============================================================ */

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

    /* ============================================================
       USER ROLE
       ============================================================ */

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