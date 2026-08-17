import groq from "../services/aiService.js";
import fs from "fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import User from "../models/User.js";

/* ============================================================
   TEST AI
   ============================================================ */
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
    });

    res.status(200).json({
      success: true,
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================================================
   ANALYZE RESUME
   ============================================================ */
export const analyzeResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log("REQ USER ID:", req.user.id);
    console.log("USER FROM DB:", user?._id);

    if (!user || !user.resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const buffer = await fs.readFile(user.resume);
    const text = await extractPDFText(buffer);

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume analyzer for software engineering placements. Always follow the requested JSON structure exactly.",
        },
        {
          role: "user",
          content: `
Analyze this resume for a software engineering placement candidate.

Return ONLY valid JSON matching this schema:

{
  "resumeScore": 8,
  "atsScore": 8,
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
    "shortTerm": [
      "example step"
    ],
    "midTerm": [
      "example step"
    ],
    "longTerm": [
      "example step"
    ]
  }
}

IMPORTANT RULES:

1. resumeScore MUST be a number.
2. atsScore MUST be a number.
3. strengths MUST be an array of strings.
4. weaknesses MUST be an array of strings.
5. missingSkills MUST be an array of strings.
6. interviewQuestions MUST be an array of strings.

7. suggestedProjects MUST ALWAYS be an ARRAY OF OBJECTS.

Each suggested project MUST have exactly this structure:

{
  "title": "Project title",
  "description": "Project description",
  "technologies": ["Technology 1", "Technology 2"]
}

NEVER return suggestedProjects as plain strings.

8. roadmap MUST be an object with exactly these three arrays:

"roadmap": {
  "shortTerm": [],
  "midTerm": [],
  "longTerm": []
}

9. roadmap.shortTerm MUST contain at least 3 items.
10. roadmap.midTerm MUST contain at least 3 items.
11. roadmap.longTerm MUST contain at least 3 items.

Resume text:

${text.substring(0, 4000)}
`,
        },
      ],
      temperature: 0.2,
    });

    const analysis = completion.choices[0].message.content;
    console.log("AI RESPONSE:", analysis);

    /* ========================================================
       CLEAN AI RESPONSE
       ======================================================== */
    const jsonStart = analysis.indexOf("{");
    const jsonEnd = analysis.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
        raw: analysis,
      });
    }

    const cleanJSON = analysis.substring(jsonStart, jsonEnd);
    let finalAnalysis;

    try {
      finalAnalysis = JSON.parse(cleanJSON);
    } catch (parseError) {
      console.error("JSON PARSE ERROR:", parseError);
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
        raw: analysis,
      });
    }

    /* ========================================================
       NORMALIZE BASIC FIELDS
       ======================================================== */
    if (!Array.isArray(finalAnalysis.strengths)) {
      finalAnalysis.strengths = [];
    }

    if (!Array.isArray(finalAnalysis.weaknesses)) {
      finalAnalysis.weaknesses = [];
    }

    if (!Array.isArray(finalAnalysis.missingSkills)) {
      finalAnalysis.missingSkills = [];
    }

    if (!Array.isArray(finalAnalysis.interviewQuestions)) {
      finalAnalysis.interviewQuestions = [];
    }

    /* ========================================================
       NORMALIZE ROADMAP
       ======================================================== */
    if (Array.isArray(finalAnalysis.roadmap)) {
      finalAnalysis.roadmap = {
        shortTerm: finalAnalysis.roadmap[0]?.steps || [],
        midTerm: finalAnalysis.roadmap[1]?.steps || [],
        longTerm: finalAnalysis.roadmap[2]?.steps || [],
      };
    }

    if (
      !finalAnalysis.roadmap ||
      typeof finalAnalysis.roadmap !== "object" ||
      Array.isArray(finalAnalysis.roadmap)
    ) {
      finalAnalysis.roadmap = {
        shortTerm: [],
        midTerm: [],
        longTerm: [],
      };
    }

    if (!Array.isArray(finalAnalysis.roadmap.shortTerm)) {
      finalAnalysis.roadmap.shortTerm = [];
    }

    if (!Array.isArray(finalAnalysis.roadmap.midTerm)) {
      finalAnalysis.roadmap.midTerm = [];
    }

    if (!Array.isArray(finalAnalysis.roadmap.longTerm)) {
      finalAnalysis.roadmap.longTerm = [];
    }

    /* ========================================================
       NORMALIZE SUGGESTED PROJECTS
       ======================================================== */
    if (!Array.isArray(finalAnalysis.suggestedProjects)) {
      finalAnalysis.suggestedProjects = [];
    }

    finalAnalysis.suggestedProjects = finalAnalysis.suggestedProjects.map(
      (project) => {
        if (typeof project === "string") {
          return {
            title: project,
            description: "",
            technologies: [],
          };
        }

        return {
          title:
            typeof project?.title === "string"
              ? project.title
              : "",

          description:
            typeof project?.description === "string"
              ? project.description
              : "",

          technologies:
            Array.isArray(project?.technologies)
              ? project.technologies
              : Array.isArray(project?.skills)
              ? project.skills
              : [],
        };
      }
    );

    /* ========================================================
       SAVE ANALYSIS
       ======================================================== */
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
      message: error.message,
    });
  }
};

/* ============================================================
   EXTRACT PDF TEXT
   ============================================================ */
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

/* ============================================================
   GET MY ANALYSIS
   ============================================================ */
export const getMyAnalysis = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user || !user.analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    res.status(200).json({
      success: true,
      analysis: user.analysis,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================================================
   GENERATE INTERVIEW QUESTIONS
   ============================================================ */
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
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical interviewer for software engineering placements. Return output strictly in valid JSON.",
        },
        {
          role: "user",
          content: `
Generate interview questions based on this candidate profile.

Return ONLY valid JSON matching this structure:

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

    const response = completion.choices[0].message.content;
    console.log("RAW RESPONSE:", response);

    const jsonStart = response.indexOf("{");
    const jsonEnd = response.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
        raw: response,
      });
    }

    const cleanJSON = response.substring(jsonStart, jsonEnd);
    const interviewQuestions = JSON.parse(cleanJSON);

    return res.status(200).json({
      success: true,
      questions: interviewQuestions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================================================
   EVALUATE INTERVIEW ANSWER
   ============================================================ */
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
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical interviewer evaluating software engineering candidates. Return output strictly in valid JSON.",
        },
        {
          role: "user",
          content: `
Evaluate this interview answer.

Return ONLY VALID JSON using this structure:

{
  "score": 8,
  "feedback": "....",
  "improvements": "...."
}

Question:
${question}

Candidate Answer:
${answer}
`,
        },
      ],
      temperature: 0.2,
    });

    const response = completion.choices[0].message.content;
    const jsonStart = response.indexOf("{");
    const jsonEnd = response.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
        raw: response,
      });
    }

    const cleanJSON = response.substring(jsonStart, jsonEnd);
    const evaluation = JSON.parse(cleanJSON);

    /* ========================================================
       SAVE INTERVIEW HISTORY
       ======================================================== */
    const user = await User.findById(req.user.id);

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
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================================================
   GET INTERVIEW HISTORY
   ============================================================ */
export const getInterviewHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("interviews");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      interviews: user.interviews,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};