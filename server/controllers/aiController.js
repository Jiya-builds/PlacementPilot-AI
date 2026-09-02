import groq from "../services/aiService.js";
import fs from "fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import User from "../models/User.js";

/* =====================================================
   HELPERS
===================================================== */

const extractJSON = (response) => {
  if (!response || typeof response !== "string") {
    throw new Error("AI returned an empty response");
  }

  let cleaned = response
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    console.error("INVALID AI RESPONSE:", response);

    throw new Error(
      "AI did not return a valid JSON object"
    );
  }

  cleaned = cleaned.substring(start, end + 1);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(
      "JSON PARSE ERROR:",
      error.message
    );

    console.error(
      "RAW AI RESPONSE:",
      response
    );

    throw new Error(
      "Failed to parse AI response as JSON"
    );
  }
};


/* =====================================================
   SCORE NORMALIZATION
===================================================== */

const normalizeScore = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return Math.max(
    0,
    Math.min(100, Math.round(number))
  );
};


/* =====================================================
   ARRAY VALIDATION
===================================================== */

const isValidStringArray = (
  value,
  minimumLength = 0
) => {
  return (
    Array.isArray(value) &&
    value.length >= minimumLength &&
    value.every(
      (item) =>
        typeof item === "string" &&
        item.trim().length > 0
    )
  );
};


/* =====================================================
   PROJECT VALIDATION
===================================================== */

const isValidProjects = (projects) => {
  if (
    !Array.isArray(projects) ||
    projects.length < 3
  ) {
    return false;
  }

  return projects.every((project) => {
    return (
      project &&
      typeof project.title === "string" &&
      project.title.trim().length > 0 &&
      typeof project.description === "string" &&
      project.description.trim().length > 0 &&
      Array.isArray(project.technologies) &&
      project.technologies.length > 0
    );
  });
};


/* =====================================================
   COMPLETE RESUME ANALYSIS VALIDATION
===================================================== */

const validateResumeAnalysis = (
  data,
  hasJobDescription
) => {
  const errors = [];

  const resumeScore =
    normalizeScore(data?.resumeScore);

  if (resumeScore === null) {
    errors.push(
      "resumeScore is missing or invalid"
    );
  }

  const atsScore =
    normalizeScore(data?.atsScore);

  if (atsScore === null) {
    errors.push(
      "atsScore is missing or invalid"
    );
  }

  if (
    !isValidStringArray(
      data?.strengths,
      3
    )
  ) {
    errors.push(
      "strengths must contain at least 3 valid items"
    );
  }

  if (
    !isValidStringArray(
      data?.weaknesses,
      3
    )
  ) {
    errors.push(
      "weaknesses must contain at least 3 valid items"
    );
  }

  if (
    !isValidStringArray(
      data?.missingSkills,
      1
    )
  ) {
    errors.push(
      "missingSkills must contain valid items"
    );
  }

  if (
    !isValidProjects(
      data?.suggestedProjects
    )
  ) {
    errors.push(
      "suggestedProjects must contain at least 3 complete projects"
    );
  }

  if (
    !isValidStringArray(
      data?.interviewQuestions,
      5
    )
  ) {
    errors.push(
      "interviewQuestions must contain at least 5 valid questions"
    );
  }

  if (
    !isValidStringArray(
      data?.roadmap?.shortTerm,
      3
    )
  ) {
    errors.push(
      "roadmap.shortTerm must contain at least 3 items"
    );
  }

  if (
    !isValidStringArray(
      data?.roadmap?.midTerm,
      3
    )
  ) {
    errors.push(
      "roadmap.midTerm must contain at least 3 items"
    );
  }

  if (
    !isValidStringArray(
      data?.roadmap?.longTerm,
      3
    )
  ) {
    errors.push(
      "roadmap.longTerm must contain at least 3 items"
    );
  }


  /* JOB MATCH VALIDATION */

  if (hasJobDescription) {
    const jobMatch = data?.jobMatch;

    if (!jobMatch) {
      errors.push(
        "jobMatch is missing"
      );
    } else {
      const matchScore =
        normalizeScore(
          jobMatch.matchScore
        );

      if (matchScore === null) {
        errors.push(
          "jobMatch.matchScore is invalid"
        );
      }

      if (
        !Array.isArray(
          jobMatch.matchedSkills
        )
      ) {
        errors.push(
          "jobMatch.matchedSkills is invalid"
        );
      }

      if (
        !Array.isArray(
          jobMatch.missingForJob
        )
      ) {
        errors.push(
          "jobMatch.missingForJob is invalid"
        );
      }

      if (
        typeof jobMatch.summary !==
          "string" ||
        jobMatch.summary.trim().length === 0
      ) {
        errors.push(
          "jobMatch.summary is invalid"
        );
      }
    }
  }


  return {
    valid: errors.length === 0,
    errors,
  };
};


/* =====================================================
   CLEAN FINAL ANALYSIS
===================================================== */

const cleanResumeAnalysis = (
  parsed,
  hasJobDescription
) => {
  const finalAnalysis = {
    resumeScore:
      normalizeScore(
        parsed.resumeScore
      ),

    atsScore:
      normalizeScore(
        parsed.atsScore
      ),

    strengths:
      parsed.strengths.map(
        (item) => item.trim()
      ),

    weaknesses:
      parsed.weaknesses.map(
        (item) => item.trim()
      ),

    missingSkills:
      parsed.missingSkills.map(
        (item) => item.trim()
      ),

    suggestedProjects:
      parsed.suggestedProjects.map(
        (project) => ({
          title:
            project.title.trim(),

          description:
            project.description.trim(),

          technologies:
            project.technologies.map(
              (tech) =>
                String(tech).trim()
            ),
        })
      ),

    interviewQuestions:
      parsed.interviewQuestions.map(
        (question) =>
          question.trim()
      ),

    roadmap: {
      shortTerm:
        parsed.roadmap.shortTerm.map(
          (item) => item.trim()
        ),

      midTerm:
        parsed.roadmap.midTerm.map(
          (item) => item.trim()
        ),

      longTerm:
        parsed.roadmap.longTerm.map(
          (item) => item.trim()
        ),
    },

    jobMatch: null,
  };


  if (
    hasJobDescription &&
    parsed.jobMatch
  ) {
    finalAnalysis.jobMatch = {
      matchScore:
        normalizeScore(
          parsed.jobMatch.matchScore
        ),

      matchedSkills:
        Array.isArray(
          parsed.jobMatch.matchedSkills
        )
          ? parsed.jobMatch.matchedSkills.map(
              (item) =>
                String(item).trim()
            )
          : [],

      missingForJob:
        Array.isArray(
          parsed.jobMatch.missingForJob
        )
          ? parsed.jobMatch.missingForJob.map(
              (item) =>
                String(item).trim()
            )
          : [],

      summary:
        parsed.jobMatch.summary.trim(),
    };
  }


  return finalAnalysis;
};


/* =====================================================
   PDF TEXT EXTRACTION
===================================================== */

const extractPDFText = async (
  buffer
) => {
  const pdf =
    await pdfjsLib.getDocument({
      data:
        new Uint8Array(buffer),
    }).promise;


  let text = "";


  for (
    let i = 1;
    i <= pdf.numPages;
    i++
  ) {
    const page =
      await pdf.getPage(i);

    const content =
      await page.getTextContent();

    const pageText =
      content.items
        .map(
          (item) => item.str
        )
        .join(" ");

    text += pageText + "\n";
  }


  return text;
};


/* =====================================================
   GENERATE RESUME ANALYSIS
===================================================== */

const generateResumeAnalysis = async ({
  resumeText,
  jobDescription,
  previousErrors = [],
}) => {
  const hasJobDescription =
    Boolean(jobDescription);


  const correctionInstructions =
    previousErrors.length > 0
      ? `
YOUR PREVIOUS RESPONSE WAS INVALID.

You MUST fix these exact problems:

${previousErrors
  .map(
    (error) =>
      `- ${error}`
  )
  .join("\n")}

Return the COMPLETE JSON object again.
Do not return only the corrected fields.
`
      : "";


  const jobInstructions =
    hasJobDescription
      ? `
The candidate has provided this job description:

${jobDescription.substring(
  0,
  3000
)}

You MUST include this additional object:

"jobMatch": {
  "matchScore": 0,
  "matchedSkills": [],
  "missingForJob": [],
  "summary": ""
}

jobMatch rules:

- matchScore must be between 0 and 100.
- matchedSkills must be an array.
- missingForJob must be an array.
- summary must not be empty.
`
      : "";


  const completion =
    await groq.chat.completions.create({
      model:
        "openai/gpt-oss-20b",

      temperature: 0.1,

      messages: [
        {
          role: "system",

          content: `
You are a precise resume analysis engine.

Your output will be parsed automatically.

Return ONLY a valid JSON object.

Never return:
- markdown
- code blocks
- explanations
- comments
- text outside JSON

Every required field MUST be present.

Do not invent candidate experience.

Scores must be realistic.
`,
        },

        {
          role: "user",

          content: `
Analyze this resume for a software engineering placement candidate.

You MUST return ALL of the following fields.

{
  "resumeScore": 0,
  "atsScore": 0,
  "strengths": [
    "string",
    "string",
    "string"
  ],
  "weaknesses": [
    "string",
    "string",
    "string"
  ],
  "missingSkills": [
    "string"
  ],
  "suggestedProjects": [
    {
      "title": "string",
      "description": "string",
      "technologies": [
        "string"
      ]
    },
    {
      "title": "string",
      "description": "string",
      "technologies": [
        "string"
      ]
    },
    {
      "title": "string",
      "description": "string",
      "technologies": [
        "string"
      ]
    }
  ],
  "interviewQuestions": [
    "string",
    "string",
    "string",
    "string",
    "string"
  ],
  "roadmap": {
    "shortTerm": [
      "string",
      "string",
      "string"
    ],
    "midTerm": [
      "string",
      "string",
      "string"
    ],
    "longTerm": [
      "string",
      "string",
      "string"
    ]
  }
}

MANDATORY RULES:

1. resumeScore MUST exist and be a number from 0 to 100.
2. atsScore MUST exist and be a number from 0 to 100.
3. strengths MUST contain at least 3 items.
4. weaknesses MUST contain at least 3 items.
5. missingSkills MUST contain at least 1 item.
6. suggestedProjects MUST contain at least 3 complete projects.
7. Every project MUST have title, description and technologies.
8. interviewQuestions MUST contain at least 5 questions.
9. roadmap.shortTerm MUST contain at least 3 items.
10. roadmap.midTerm MUST contain at least 3 items.
11. roadmap.longTerm MUST contain at least 3 items.
12. NEVER omit any field.
13. NEVER use null for any required field.
14. Return the COMPLETE JSON object.

SCORING:

resumeScore = overall quality of the resume.

atsScore = ATS compatibility based on:
- standard section headings
- relevant technical keywords
- readability
- measurable achievements
- software engineering relevance

${jobInstructions}

${correctionInstructions}

RESUME:

${resumeText.substring(
  0,
  7000
)}
`,
        },
      ],
    });


  const response =
    completion.choices?.[0]
      ?.message?.content;


  console.log(
    "RAW AI RESPONSE:",
    response
  );


  return extractJSON(response);
};


/* =====================================================
   TEST AI
===================================================== */

export const testAI =
  async (req, res) => {
    try {
      const completion =
        await groq.chat.completions.create({
          model:
            "openai/gpt-oss-20b",

          messages: [
            {
              role: "user",

              content:
                "Say Hello PlacementPilot AI",
            },
          ],
        });


      return res.status(200).json({
        success: true,

        message:
          completion.choices?.[0]
            ?.message?.content ||
          "",
      });


    } catch (error) {
      console.error(
        "TEST AI ERROR:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


/* =====================================================
   ANALYZE RESUME
===================================================== */

export const analyzeResume =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.id
        );


      if (
        !user ||
        !user.resume
      ) {
        return res.status(404).json({
          success: false,

          message:
            "Resume not found",
        });
      }


      /* READ PDF */

      const buffer =
        await fs.readFile(
          user.resume
        );

      const text =
        await extractPDFText(
          buffer
        );


      if (
        !text ||
        text.trim().length < 30
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Could not extract enough text from resume",
        });
      }


      const jobDescription =
        typeof user.jobDescription ===
        "string"
          ? user.jobDescription.trim()
          : "";


      const hasJobDescription =
        Boolean(
          jobDescription
        );


      /* ---------------------------------------------
         AI ATTEMPT 1
      --------------------------------------------- */

      let parsed =
        await generateResumeAnalysis({
          resumeText: text,

          jobDescription,
        });


      let validation =
        validateResumeAnalysis(
          parsed,
          hasJobDescription
        );


      console.log(
        "VALIDATION ATTEMPT 1:",
        validation
      );


      /* ---------------------------------------------
         AI RETRY IF RESPONSE INCOMPLETE
      --------------------------------------------- */

      if (!validation.valid) {
        console.log(
          "RETRYING AI BECAUSE FIELDS ARE MISSING..."
        );


        parsed =
          await generateResumeAnalysis({
            resumeText: text,

            jobDescription,

            previousErrors:
              validation.errors,
          });


        validation =
          validateResumeAnalysis(
            parsed,
            hasJobDescription
          );


        console.log(
          "VALIDATION ATTEMPT 2:",
          validation
        );
      }


      /* ---------------------------------------------
         FINAL FAILURE
      --------------------------------------------- */

      if (!validation.valid) {
        return res.status(422).json({
          success: false,

          message:
            "AI returned an incomplete analysis. Please try again.",

          errors:
            validation.errors,
        });
      }


      /* ---------------------------------------------
         CLEAN DATA
      --------------------------------------------- */

      const finalAnalysis =
        cleanResumeAnalysis(
          parsed,
          hasJobDescription
        );


      console.log(
        "FINAL ANALYSIS:",
        JSON.stringify(
          finalAnalysis,
          null,
          2
        )
      );


      /* ---------------------------------------------
         SAVE
      --------------------------------------------- */

      user.analysis =
        finalAnalysis;

      await user.save();


      return res.status(200).json({
        success: true,

        analysis:
          finalAnalysis,
      });


    } catch (error) {
      console.error(
        "RESUME ANALYSIS ERROR:",
        error
      );


      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Failed to analyze resume",
      });
    }
  };


/* =====================================================
   GET MY ANALYSIS
===================================================== */

export const getMyAnalysis =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.id
        )
          .select(
            "-password"
          );


      if (
        !user ||
        !user.analysis
      ) {
        return res.status(404).json({
          success: false,

          message:
            "Analysis not found",
        });
      }


      return res.status(200).json({
        success: true,

        analysis:
          user.analysis,
      });


    } catch (error) {
      console.error(
        "GET ANALYSIS ERROR:",
        error
      );


      return res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };


/* =====================================================
   GENERATE INTERVIEW QUESTIONS
===================================================== */

export const generateInterviewQuestions =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.id
        );


      if (
        !user ||
        !user.analysis
      ) {
        return res.status(404).json({
          success: false,

          message:
            "Please analyze resume first",
        });
      }


      const completion =
        await groq.chat.completions.create({
          model:
            "openai/gpt-oss-20b",

          temperature: 0.2,

          messages: [
            {
              role: "system",

              content: `
You are an expert technical interviewer.

Return ONLY valid JSON.
Do not return markdown.
`,
            },

            {
              role: "user",

              content: `
Generate interview questions.

Return exactly:

{
  "technicalQuestions": [],
  "projectQuestions": [],
  "HRQuestions": []
}

Rules:
- technicalQuestions: minimum 5
- projectQuestions: minimum 3
- HRQuestions: minimum 3

Candidate:

${JSON.stringify(
  user.analysis
)}
`,
            },
          ],
        });


      const response =
        completion.choices?.[0]
          ?.message?.content;


      const questions =
        extractJSON(response);


      return res.status(200).json({
        success: true,
        questions,
      });


    } catch (error) {
      console.error(
        "INTERVIEW QUESTIONS ERROR:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


/* =====================================================
   EVALUATE INTERVIEW ANSWER
===================================================== */

export const evaluateAnswer =
  async (req, res) => {
    try {
      const {
        question,
        answer,
      } = req.body;


      if (
        !question ||
        !answer
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Question and answer required",
        });
      }


      const completion =
        await groq.chat.completions.create({
          model:
            "openai/gpt-oss-20b",

          temperature: 0.2,

          messages: [
            {
              role: "system",

              content: `
You are an expert technical interviewer.

Return ONLY valid JSON.
`,
            },

            {
              role: "user",

              content: `
Evaluate this answer.

Return:

{
  "score": 0,
  "feedback": "",
  "improvements": ""
}

score must be between 0 and 100.

Question:
${question}

Answer:
${answer}
`,
            },
          ],
        });


      const response =
        completion.choices?.[0]
          ?.message?.content;


      const evaluation =
        extractJSON(response);


      const score =
        normalizeScore(
          evaluation.score
        );


      if (score === null) {
        throw new Error(
          "AI returned invalid interview score"
        );
      }


      const user =
        await User.findById(
          req.user.id
        );


      if (!user) {
        return res.status(404).json({
          success: false,

          message:
            "User not found",
        });
      }


      user.interviews.push({
        question,

        answer,

        score,

        feedback:
          typeof evaluation.feedback ===
          "string"
            ? evaluation.feedback
            : "",
      });


      await user.save();


      return res.status(200).json({
        success: true,

        evaluation: {
          score,

          feedback:
            typeof evaluation.feedback ===
            "string"
              ? evaluation.feedback
              : "",

          improvements:
            typeof evaluation.improvements ===
            "string"
              ? evaluation.improvements
              : "",
        },
      });


    } catch (error) {
      console.error(
        "EVALUATE ANSWER ERROR:",
        error
      );


      return res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };


/* =====================================================
   GET INTERVIEW HISTORY
===================================================== */

export const getInterviewHistory =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.id
        )
          .select(
            "interviews"
          );


      if (!user) {
        return res.status(404).json({
          success: false,

          message:
            "User not found",
        });
      }


      return res.status(200).json({
        success: true,

        interviews:
          Array.isArray(
            user.interviews
          )
            ? user.interviews
            : [],
      });


    } catch (error) {
      console.error(
        "INTERVIEW HISTORY ERROR:",
        error
      );


      return res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };