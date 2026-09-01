import groq from "../services/aiService.js";
import fs from "fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import User from "../models/User.js";


/* =====================================================
   HELPERS
===================================================== */

// Extract JSON safely from AI response
const extractJSON = (response) => {
  if (!response || typeof response !== "string") {
    throw new Error("AI returned an empty response");
  }

  let cleaned = response
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Find first { and last }
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("AI did not return valid JSON");
  }

  cleaned = cleaned.substring(jsonStart, jsonEnd + 1);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("JSON PARSE ERROR");
    console.error("RAW CLEANED RESPONSE:", cleaned);

    throw new Error("Failed to parse AI response as JSON");
  }
};


// Convert score safely to 0-10
const normalizeScore10 = (score, fallback = 0) => {
  const value = Number(score);

  if (Number.isNaN(value)) {
    return fallback;
  }

  // If AI accidentally returns percentage
  if (value > 10) {
    return Math.min(10, Math.round(value / 10));
  }

  return Math.max(0, Math.min(10, value));
};


// Normalize analysis data
const normalizeAnalysis = (analysis, hasJobDescription = false) => {
  if (!analysis || typeof analysis !== "object") {
    analysis = {};
  }

  analysis.resumeScore = normalizeScore10(
    analysis.resumeScore,
    0
  );

  analysis.atsScore = normalizeScore10(
    analysis.atsScore,
    0
  );


  // Arrays
  analysis.strengths = Array.isArray(analysis.strengths)
    ? analysis.strengths
    : [];

  analysis.weaknesses = Array.isArray(analysis.weaknesses)
    ? analysis.weaknesses
    : [];

  analysis.missingSkills = Array.isArray(analysis.missingSkills)
    ? analysis.missingSkills
    : [];

  analysis.interviewQuestions = Array.isArray(
    analysis.interviewQuestions
  )
    ? analysis.interviewQuestions
    : [];


  // Suggested Projects
  if (!Array.isArray(analysis.suggestedProjects)) {
    analysis.suggestedProjects = [];
  }

  analysis.suggestedProjects =
    analysis.suggestedProjects.map((project) => {
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
          : Array.isArray(project?.skills)
          ? project.skills
          : [],
      };
    });


  // Roadmap
  if (Array.isArray(analysis.roadmap)) {
    analysis.roadmap = {
      shortTerm: analysis.roadmap[0]?.steps || [],
      midTerm: analysis.roadmap[1]?.steps || [],
      longTerm: analysis.roadmap[2]?.steps || [],
    };
  }

  if (!analysis.roadmap || typeof analysis.roadmap !== "object") {
    analysis.roadmap = {};
  }

  analysis.roadmap.shortTerm = Array.isArray(
    analysis.roadmap.shortTerm
  )
    ? analysis.roadmap.shortTerm
    : [];

  analysis.roadmap.midTerm = Array.isArray(
    analysis.roadmap.midTerm
  )
    ? analysis.roadmap.midTerm
    : [];

  analysis.roadmap.longTerm = Array.isArray(
    analysis.roadmap.longTerm
  )
    ? analysis.roadmap.longTerm
    : [];


  // Job Match
  if (hasJobDescription) {
    if (!analysis.jobMatch || typeof analysis.jobMatch !== "object") {
      analysis.jobMatch = {
        matchScore: 0,
        matchedSkills: [],
        missingForJob: [],
        summary: "",
      };
    }

    analysis.jobMatch.matchScore = normalizeScore10(
      analysis.jobMatch.matchScore,
      0
    );

    analysis.jobMatch.matchedSkills = Array.isArray(
      analysis.jobMatch.matchedSkills
    )
      ? analysis.jobMatch.matchedSkills
      : [];

    analysis.jobMatch.missingForJob = Array.isArray(
      analysis.jobMatch.missingForJob
    )
      ? analysis.jobMatch.missingForJob
      : [];

    analysis.jobMatch.summary =
      analysis.jobMatch.summary || "";
  } else {
    analysis.jobMatch = null;
  }

  return analysis;
};


/* =====================================================
   TEST AI
===================================================== */

export const testAI = async (req, res) => {
  try {
    const completion =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",

        messages: [
          {
            role: "user",
            content: "Say Hello PlacementPilot AI",
          },
        ],
      });

    res.status(200).json({
      success: true,
      message:
        completion.choices?.[0]?.message?.content ||
        "No response",
    });

  } catch (error) {
    console.error("TEST AI ERROR:", error);

    res.status(500).json({
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


    /* READ PDF */

    const buffer = await fs.readFile(user.resume);

    const text = await extractPDFText(buffer);


    if (!text || text.trim().length < 30) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract enough text from the resume",
      });
    }


    const jobDescription =
      (user.jobDescription || "").trim();


    /* JOB MATCH INSTRUCTIONS */

    const jobMatchInstructions = jobDescription
      ? `

Also include this object:

"jobMatch": {
  "matchScore": 0,
  "matchedSkills": [],
  "missingForJob": [],
  "summary": ""
}

Rules for jobMatch:
- matchScore must be a NUMBER from 0 to 10
- matchedSkills must be an array of strings
- missingForJob must be an array of strings
- summary must be a short string

Target Job Description:

${jobDescription.substring(0, 3000)}

`
      : "";


    /* AI REQUEST */

    const completion =
      await groq.chat.completions.create({

        model: "openai/gpt-oss-20b",

        messages: [

          {
            role: "system",

            content: `
You are an expert resume analyzer.

Analyze software engineering resumes accurately.

IMPORTANT OUTPUT RULES:

Return ONLY a valid JSON object.

Do not use markdown.

Do not use triple backticks.

Do not write anything before the opening {.

Do not write anything after the closing }.

All scores must be NUMBERS from 0 to 10.

All arrays must contain valid JSON values.

Do not include comments.

Do not include trailing commas.
`,
          },


          {
            role: "user",

            content: `
Analyze the following resume for software engineering placements.

Return JSON using EXACTLY this structure:

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

Rules:

1. resumeScore must be between 0 and 10.
2. atsScore must be between 0 and 10.
3. strengths must be an array of strings.
4. weaknesses must be an array of strings.
5. missingSkills must be an array of strings.
6. suggestedProjects must contain project objects.
7. Every project must contain:
   title,
   description,
   technologies.
8. roadmap must be an object.
9. shortTerm must contain at least 3 items.
10. midTerm must contain at least 3 items.
11. longTerm must contain at least 3 items.
12. Do not use markdown.
13. Return ONLY JSON.

${jobMatchInstructions}

RESUME TEXT:

${text.substring(0, 5000)}
`,
          },

        ],

        temperature: 0.2,

      });


    /* GET AI RESPONSE */

    const response =
      completion.choices?.[0]?.message?.content;


    console.log(
      "RAW RESUME AI RESPONSE:",
      response
    );


    /* PARSE JSON */

    const parsedAnalysis =
      extractJSON(response);


    /* NORMALIZE */

    const finalAnalysis =
      normalizeAnalysis(
        parsedAnalysis,
        Boolean(jobDescription)
      );


    console.log(
      "FINAL ANALYSIS:",
      JSON.stringify(finalAnalysis, null, 2)
    );


    /* SAVE */

    user.analysis = finalAnalysis;

    await user.save();


    return res.status(200).json({
      success: true,
      analysis: finalAnalysis,
    });


  } catch (error) {

    console.error(
      "RESUME ANALYSIS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =====================================================
   EXTRACT PDF TEXT
===================================================== */

const extractPDFText = async (buffer) => {

  const pdf =
    await pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
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
        .map((item) => item.str)
        .join(" ");


    text += pageText + "\n";
  }


  return text;
};


/* =====================================================
   GET MY ANALYSIS
===================================================== */

export const getMyAnalysis = async (req, res) => {
  try {

    const user =
      await User.findById(req.user.id)
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

    console.error(
      "GET ANALYSIS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
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
        await User.findById(req.user.id);


      if (!user || !user.analysis) {
        return res.status(404).json({
          success: false,
          message:
            "Please analyze resume first",
        });
      }


      const completion =
        await groq.chat.completions.create({

          model: "openai/gpt-oss-20b",

          messages: [

            {
              role: "system",

              content: `
You are an expert technical interviewer.

Return ONLY valid JSON.

No markdown.
No explanations.
No code blocks.
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


      const interviewQuestions =
        extractJSON(response);


      return res.status(200).json({
        success: true,
        questions: {
          technicalQuestions:
            Array.isArray(
              interviewQuestions.technicalQuestions
            )
              ? interviewQuestions.technicalQuestions
              : [],

          projectQuestions:
            Array.isArray(
              interviewQuestions.projectQuestions
            )
              ? interviewQuestions.projectQuestions
              : [],

          HRQuestions:
            Array.isArray(
              interviewQuestions.HRQuestions
            )
              ? interviewQuestions.HRQuestions
              : [],
        },
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
   EVALUATE ANSWER
===================================================== */

export const evaluateAnswer =
  async (req, res) => {

    try {

      const { question, answer } =
        req.body;


      if (!question || !answer) {
        return res.status(400).json({
          success: false,
          message:
            "Question and answer required",
        });
      }


      const completion =
        await groq.chat.completions.create({

          model: "openai/gpt-oss-20b",

          messages: [

            {
              role: "system",

              content: `
You are an expert technical interviewer.

Return ONLY valid JSON.

Do not use markdown.
Do not add any text outside JSON.
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

- score must be a number from 0 to 10
- feedback must be a string
- improvements must be a string

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


      const evaluation =
        extractJSON(response);


      evaluation.score =
        normalizeScore10(
          evaluation.score,
          0
        );

      evaluation.feedback =
        evaluation.feedback || "";

      evaluation.improvements =
        evaluation.improvements || "";


      /* SAVE INTERVIEW */

      const user =
        await User.findById(req.user.id);


      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
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

export const getInterviewHistory =
  async (req, res) => {

    try {

      const user =
        await User.findById(req.user.id)
          .select("interviews");


      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }


      return res.status(200).json({
        success: true,
        interviews:
          Array.isArray(user.interviews)
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