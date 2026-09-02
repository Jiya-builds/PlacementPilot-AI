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
    throw new Error("AI did not return valid JSON");
  }

  cleaned = cleaned.substring(start, end + 1);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("JSON PARSE ERROR:", error.message);
    console.error("AI RESPONSE:", response);
    throw new Error("Failed to parse AI response as JSON");
  }
};

const normalizePercentage = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  if (number >= 0 && number <= 10) {
    return Math.round(number * 10);
  }

  return Math.max(0, Math.min(100, Math.round(number)));
};

/* =====================================================
   PDF TEXT EXTRACTION
===================================================== */

const extractPDFText = async (buffer) => {
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
  }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((item) => item.str)
      .join(" ");

    text += pageText + "\n";
  }

  return text;
};

/* =====================================================
   TEST AI
===================================================== */

export const testAI = async (req, res) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: "Say Hello PlacementPilot AI",
        },
      ],
      temperature: 0.2,
    });

    return res.status(200).json({
      success: true,
      message: completion.choices?.[0]?.message?.content || "",
    });
  } catch (error) {
    console.error("TEST AI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ANALYZE RESUME
===================================================== */

export const analyzeResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const buffer = await fs.readFile(user.resume);
    const text = await extractPDFText(buffer);

    if (!text || text.trim().length < 30) {
      return res.status(400).json({
        success: false,
        message: "Could not extract enough text from resume",
      });
    }

    const jobDescription =
      typeof user.jobDescription === "string"
        ? user.jobDescription.trim()
        : "";

    const jobMatchInstructions = jobDescription
      ? `
The candidate also provided a target job description.

You MUST include this object at the top level:

"jobMatch": {
  "matchScore": 0,
  "matchedSkills": [],
  "missingForJob": [],
  "summary": ""
}

Rules:
- matchScore must be a number from 0 to 100.
- matchedSkills must be an array of strings.
- missingForJob must be an array of strings.
- summary must be a short 1-2 sentence explanation.

TARGET JOB DESCRIPTION:
${jobDescription.substring(0, 3000)}
`
      : "";

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
You are an expert resume analyzer for software engineering placements.

Analyze ONLY the information present in the candidate's resume.

Return ONLY one valid JSON object.

IMPORTANT RULES:
- Do not use markdown.
- Do not use code blocks.
- Do not write explanations before or after JSON.
- Do not invent experience, skills, achievements, or projects.
- All scores must be numbers between 0 and 100.
- Never use null for scores.
`,
        },

        {
          role: "user",
          content: `
Analyze this resume for a software engineering placement candidate.

Return EXACTLY this JSON structure:

{
  "resumeScore": 0,
  "atsScore": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestedProjects": [
    {
      "title": "",
      "description": "",
      "technologies": []
    }
  ],
  "interviewQuestions": [],
  "roadmap": {
    "shortTerm": [],
    "midTerm": [],
    "longTerm": []
  }
}

SCORING RULES:

resumeScore:
Overall resume quality from 0 to 100.

atsScore:
ATS compatibility from 0 to 100.

IMPORTANT REQUIREMENTS:

1. resumeScore must be a number from 0 to 100.
2. atsScore must be a number from 0 to 100.
3. strengths must contain at least 3 useful observations.
4. weaknesses must contain at least 3 useful observations.
5. missingSkills must contain relevant software engineering skills.
6. suggestedProjects must contain at least 3 projects.
7. Each project must contain title, description and technologies.
8. roadmap.shortTerm must contain at least 3 items.
9. roadmap.midTerm must contain at least 3 items.
10. roadmap.longTerm must contain at least 3 items.
11. interviewQuestions must contain useful interview questions.
12. Do not invent experience that does not exist in the resume.
13. Return ONLY valid JSON.

${jobMatchInstructions}

RESUME TEXT:

${text.substring(0, 6000)}
`,
        },
      ],

      temperature: 0.2,
    });

    const response =
      completion.choices?.[0]?.message?.content;

    console.log("RAW RESUME AI RESPONSE:", response);

    const parsed = extractJSON(response);

    const finalAnalysis = {
      resumeScore: normalizePercentage(parsed.resumeScore),

      atsScore: normalizePercentage(parsed.atsScore),

      strengths: Array.isArray(parsed.strengths)
        ? parsed.strengths
        : [],

      weaknesses: Array.isArray(parsed.weaknesses)
        ? parsed.weaknesses
        : [],

      missingSkills: Array.isArray(parsed.missingSkills)
        ? parsed.missingSkills
        : [],

      suggestedProjects: Array.isArray(parsed.suggestedProjects)
        ? parsed.suggestedProjects.map((project) => {
            if (typeof project === "string") {
              return {
                title: project,
                description: "",
                technologies: [],
              };
            }

            return {
              title: project?.title || "",
              description: project?.description || "",
              technologies: Array.isArray(project?.technologies)
                ? project.technologies
                : [],
            };
          })
        : [],

      interviewQuestions: Array.isArray(parsed.interviewQuestions)
        ? parsed.interviewQuestions
        : [],

      roadmap: {
        shortTerm: Array.isArray(parsed.roadmap?.shortTerm)
          ? parsed.roadmap.shortTerm
          : [],

        midTerm: Array.isArray(parsed.roadmap?.midTerm)
          ? parsed.roadmap.midTerm
          : [],

        longTerm: Array.isArray(parsed.roadmap?.longTerm)
          ? parsed.roadmap.longTerm
          : [],
      },

      jobMatch: null,
    };

    if (jobDescription) {
      const match = parsed.jobMatch || {};

      finalAnalysis.jobMatch = {
        matchScore: normalizePercentage(match.matchScore),

        matchedSkills: Array.isArray(match.matchedSkills)
          ? match.matchedSkills
          : [],

        missingForJob: Array.isArray(match.missingForJob)
          ? match.missingForJob
          : [],

        summary:
          typeof match.summary === "string"
            ? match.summary
            : "",
      };
    }

    console.log(
      "FINAL ANALYSIS:",
      JSON.stringify(finalAnalysis, null, 2)
    );

    user.analysis = finalAnalysis;

    await user.save();

    return res.status(200).json({
      success: true,
      analysis: finalAnalysis,
    });

  } catch (error) {
    console.error("RESUME ANALYSIS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze resume",
    });
  }
};

/* =====================================================
   GET MY ANALYSIS
===================================================== */

export const getMyAnalysis = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user || !user.analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    return res.status(200).json({
      success: true,
      analysis: user.analysis,
    });

  } catch (error) {
    console.error("GET ANALYSIS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   GENERATE INTERVIEW QUESTIONS
===================================================== */

export const generateInterviewQuestions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.analysis) {
      return res.status(404).json({
        success: false,
        message: "Please analyze resume first",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
You are an expert technical interviewer.

Return ONLY one valid JSON object.
Do not return markdown.
Do not use code blocks.
Do not write anything outside the JSON.
`,
        },

        {
          role: "user",
          content: `
Generate interview questions based on this candidate profile.

Return exactly this JSON structure:

{
  "technicalQuestions": [],
  "projectQuestions": [],
  "HRQuestions": []
}

Requirements:
- technicalQuestions should contain at least 5 questions.
- projectQuestions should contain at least 3 questions.
- HRQuestions should contain at least 3 questions.

Candidate Analysis:

${JSON.stringify(user.analysis)}
`,
        },
      ],

      temperature: 0.3,
    });

    const response =
      completion.choices?.[0]?.message?.content;

    console.log(
      "RAW INTERVIEW QUESTIONS:",
      response
    );

    const questions = extractJSON(response);

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
      message: error.message,
    });
  }
};

/* =====================================================
   EVALUATE INTERVIEW ANSWER
===================================================== */

export const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer required",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
You are an expert technical interviewer.

Evaluate the candidate fairly.

Return ONLY one valid JSON object.
Do not return markdown.
Do not use code blocks.
Do not write anything outside the JSON.
`,
        },

        {
          role: "user",
          content: `
Evaluate this interview answer.

Return exactly:

{
  "score": 0,
  "feedback": "",
  "improvements": ""
}

Rules:
- score must be a number between 0 and 100.
- feedback must be useful and specific.
- improvements must provide actionable advice.
- Do not give an artificially high score.

Question:
${question}

Candidate Answer:
${answer}
`,
        },
      ],

      temperature: 0.2,
    });

    const response =
      completion.choices?.[0]?.message?.content;

    console.log(
      "RAW EVALUATION RESPONSE:",
      response
    );

    const evaluation = extractJSON(response);

    evaluation.score =
      normalizePercentage(evaluation.score);

    evaluation.feedback =
      typeof evaluation.feedback === "string"
        ? evaluation.feedback
        : "";

    evaluation.improvements =
      typeof evaluation.improvements === "string"
        ? evaluation.improvements
        : "";

    const user =
      await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!Array.isArray(user.interviews)) {
      user.interviews = [];
    }

    user.interviews.push({
      question,
      answer,
      score: evaluation.score,
      feedback: evaluation.feedback,
    });

    await user.save();

    return res.status(200).json({
      success: true,
      evaluation,
    });

  } catch (error) {
    console.error(
      "EVALUATE ANSWER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   GET INTERVIEW HISTORY
===================================================== */

export const getInterviewHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("interviews");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      interviews: Array.isArray(user.interviews)
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
      message: error.message,
    });
  }
};