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

    return res.status(200).json({
      success: true,
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("TEST AI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================================================
   CALCULATE RESUME QUALITY SCORE
   ============================================================ */

const calculateResumeScore = (analysis) => {
  let score = 0;

  const skills = Array.isArray(analysis.skills)
    ? analysis.skills
    : [];

  if (skills.length >= 10) {
    score += 20;
  } else if (skills.length >= 8) {
    score += 18;
  } else if (skills.length >= 6) {
    score += 15;
  } else if (skills.length >= 4) {
    score += 12;
  } else if (skills.length >= 2) {
    score += 8;
  } else if (skills.length === 1) {
    score += 4;
  }

  const projects = Array.isArray(analysis.projects)
    ? analysis.projects
    : [];

  if (projects.length >= 3) {
    score += 20;
  } else if (projects.length === 2) {
    score += 16;
  } else if (projects.length === 1) {
    score += 10;
  }

  const experience = Array.isArray(analysis.experience)
    ? analysis.experience
    : [];

  if (experience.length >= 2) {
    score += 20;
  } else if (experience.length === 1) {
    score += 14;
  }

  const education = Array.isArray(analysis.education)
    ? analysis.education
    : [];

  if (education.length > 0) {
    score += 10;
  }

  const achievements = Array.isArray(analysis.achievements)
    ? analysis.achievements
    : [];

  if (achievements.length >= 3) {
    score += 10;
  } else if (achievements.length >= 1) {
    score += 6;
  }

  const certifications = Array.isArray(analysis.certifications)
    ? analysis.certifications
    : [];

  if (certifications.length >= 2) {
    score += 5;
  } else if (certifications.length === 1) {
    score += 3;
  }

  const importantSections = [
    "education",
    "skills",
    "projects",
    "experience",
    "certifications",
    "achievements",
  ];

  const sections = Array.isArray(analysis.sectionsPresent)
    ? analysis.sectionsPresent.map((section) =>
        String(section).toLowerCase().trim()
      )
    : [];

  const matchedSections = importantSections.filter((section) =>
    sections.some((item) => item.includes(section))
  );

  score += Math.round(
    (matchedSections.length / importantSections.length) * 15
  );

  return Math.max(0, Math.min(100, Math.round(score)));
};

/* ============================================================
   ANALYZE RESUME
   ============================================================ */

export const analyzeResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    console.log("=================================");
    console.log("Analyzing resume for user:", req.user.id);
    console.log("=================================");

    const buffer = await fs.readFile(user.resume);

    const text = await extractPDFText(buffer);

    if (!text || text.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract enough text from this PDF. Please upload a text-based resume.",
      });
    }

    const resumeText = text.substring(0, 8000);

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",

          content: `
You are a professional resume analyzer for software engineering and technology placements.

Analyze ONLY information actually present in the resume.

STRICT RULES:

1. Never invent experience.
2. Never invent companies.
3. Never invent internships.
4. Never invent projects.
5. Never invent technologies.
6. Never assume a technology is known unless explicitly mentioned.
7. Never calculate ATS score.
8. ATS requires a Job Description and is handled separately.
9. Do not create generic missing skills just because they are popular.
10. Missing skills must logically complement the candidate's current profile.
11. Keep all extracted information grounded in the resume.
12. Return only valid JSON.
`,
        },

        {
          role: "user",

          content: `
Analyze this resume.

Return EXACTLY:

{
  "resumeScore": 0,
  "skills": [],
  "projects": [],
  "experience": [],
  "education": [],
  "certifications": [],
  "achievements": [],
  "sectionsPresent": [],
  "measurableAchievements": 0,
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

resumeScore:
- Preliminary quality estimate 0-100.
- Final deterministic score will be calculated by application.
- Do not calculate ATS.

skills:
- Only technologies, programming languages, frameworks, databases, tools and technical skills explicitly present.

projects:
- Every clearly identifiable project.

experience:
- Every internship, job or work experience.

education:
- Actual education only.

certifications:
- Actual certifications only.

achievements:
- Actual achievements only.

sectionsPresent:
- Only sections actually present.

measurableAchievements:
Count measurable evidence such as percentages, numbers, rankings, users, accuracy, performance improvement, time reduction or scale.

strengths:
- 4 to 6 resume-specific strengths.

weaknesses:
- 3 to 6 resume-specific weaknesses.

missingSkills:
- This is NOT ATS missing skills.
- There is no Job Description.
- Suggest only skills that logically complement the existing profile.

suggestedProjects:
- 2 to 4 realistic projects.
- Build upon existing skills.
- Do not claim they already exist.

roadmap:
- Short term: 3 or more actionable items.
- Mid term: 3 or more actionable items.
- Long term: 3 or more actionable items.

interviewQuestions:
- 6 to 10 questions based specifically on the resume.

Do not invent anything.

RESUME:

${resumeText}
`,
        },
      ],

      temperature: 0.1,
    });

    const rawResponse =
      completion?.choices?.[0]?.message?.content;

    if (!rawResponse) {
      return res.status(500).json({
        success: false,
        message: "AI returned an empty response",
      });
    }

    console.log("RAW AI RESPONSE:");
    console.log(rawResponse);

    let finalAnalysis;

    try {
      const jsonStart = rawResponse.indexOf("{");
      const jsonEnd = rawResponse.lastIndexOf("}") + 1;

      if (
        jsonStart === -1 ||
        jsonEnd <= jsonStart
      ) {
        throw new Error("No valid JSON object found");
      }

      const cleanJSON = rawResponse.substring(
        jsonStart,
        jsonEnd
      );

      finalAnalysis = JSON.parse(cleanJSON);
    } catch (error) {
      console.error("JSON PARSE ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
      });
    }

    const arrayFields = [
      "skills",
      "projects",
      "experience",
      "education",
      "certifications",
      "achievements",
      "sectionsPresent",
      "strengths",
      "weaknesses",
      "missingSkills",
      "interviewQuestions",
    ];

    arrayFields.forEach((field) => {
      if (!Array.isArray(finalAnalysis[field])) {
        finalAnalysis[field] = [];
      }
    });

    if (
      !finalAnalysis.roadmap ||
      typeof finalAnalysis.roadmap !== "object" ||
      Array.isArray(finalAnalysis.roadmap)
    ) {
      finalAnalysis.roadmap = {};
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

    if (!Array.isArray(finalAnalysis.suggestedProjects)) {
      finalAnalysis.suggestedProjects = [];
    }

    finalAnalysis.suggestedProjects =
      finalAnalysis.suggestedProjects.map((project) => {
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
              : [],
        };
      });

    finalAnalysis.measurableAchievements =
      Number(finalAnalysis.measurableAchievements) || 0;

    const calculatedResumeScore =
      calculateResumeScore(finalAnalysis);

    finalAnalysis.resumeScore =
      calculatedResumeScore;

    /*
     * ATS is calculated separately using a Job Description.
     */
    finalAnalysis.atsScore = null;

    console.log("=================================");
    console.log(
      "RESUME SCORE:",
      calculatedResumeScore
    );

    console.log(
      "ATS SCORE:",
      "Not calculated - Job Description required"
    );

    console.log(
      "SKILLS:",
      finalAnalysis.skills.length
    );

    console.log(
      "PROJECTS:",
      finalAnalysis.projects.length
    );

    console.log(
      "EXPERIENCE:",
      finalAnalysis.experience.length
    );

    console.log(
      "SECTIONS:",
      finalAnalysis.sectionsPresent.length
    );

    console.log("=================================");

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

/* ============================================================
   EXTRACT PDF TEXT
   ============================================================ */

const extractPDFText = async (buffer) => {
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
  }).promise;

  let text = "";

  for (
    let pageNumber = 1;
    pageNumber <= pdf.numPages;
    pageNumber++
  ) {
    const page = await pdf.getPage(pageNumber);

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

/* ============================================================
   ATS MATCH SCORE USING JOB DESCRIPTION
   ============================================================ */

export const calculateATSMatch = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    /* --------------------------------------------------------
       VALIDATE JD
       -------------------------------------------------------- */

    if (
      !jobDescription ||
      typeof jobDescription !== "string" ||
      jobDescription.trim().length < 50
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid job description of at least 50 characters.",
      });
    }

    /* --------------------------------------------------------
       FIND USER
       -------------------------------------------------------- */

    const user = await User.findById(req.user.id);

    if (!user || !user.analysis) {
      return res.status(404).json({
        success: false,
        message:
          "Please analyze your resume first.",
      });
    }

    const resumeAnalysis = user.analysis;

    const resumeSkills =
      Array.isArray(resumeAnalysis.skills)
        ? resumeAnalysis.skills
        : [];

    const resumeProjects =
      Array.isArray(resumeAnalysis.projects)
        ? resumeAnalysis.projects
        : [];

    const resumeExperience =
      Array.isArray(resumeAnalysis.experience)
        ? resumeAnalysis.experience
        : [];

    const resumeEducation =
      Array.isArray(resumeAnalysis.education)
        ? resumeAnalysis.education
        : [];

    /* --------------------------------------------------------
       AI ATS MATCHING
       -------------------------------------------------------- */

    const completion =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",

        response_format: {
          type: "json_object",
        },

        messages: [
          {
            role: "system",

            content: `
You are a professional Applicant Tracking System evaluator.

Compare the candidate's resume ONLY against the provided Job Description.

ATS SCORE MUST REPRESENT MATCH WITH THIS SPECIFIC JOB DESCRIPTION.

RULES:

1. ATS score must be an integer from 0 to 100.
2. Do not score simply based on number of resume skills.
3. Identify important requirements of THIS JD.
4. Compare requirements against the candidate's resume.
5. Do not assume a skill exists.
6. Do not invent experience.
7. Do not invent projects.
8. Do not invent education.
9. Separate required and preferred skills.
10. Consider relevant experience and projects.
11. Consider keywords actually present in both.
12. Do not mark unrelated technologies as missing.
13. Return only valid JSON.
`,
          },

          {
            role: "user",

            content: `
Compare the candidate against this specific Job Description.

========================
JOB DESCRIPTION
========================

${jobDescription}

========================
CANDIDATE RESUME
========================

Skills:
${JSON.stringify(resumeSkills)}

Projects:
${JSON.stringify(resumeProjects)}

Experience:
${JSON.stringify(resumeExperience)}

Education:
${JSON.stringify(resumeEducation)}

========================
RETURN EXACTLY
========================

{
  "atsScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "matchedKeywords": [],
  "missingKeywords": [],
  "experienceMatch": "",
  "projectMatch": "",
  "educationMatch": "",
  "summary": "",
  "recommendations": []
}

RULES:

atsScore:
- Integer 0-100.
- Must represent compatibility with THIS JD.

matchedSkills:
- Important skills required by JD that are clearly present in resume.

missingSkills:
- Important skills required by JD that are absent from resume.
- Do not include unrelated skills.

matchedKeywords:
- Important JD-specific keywords appearing in resume.

missingKeywords:
- Important JD-specific keywords not appearing in resume.

experienceMatch:
- Explain how candidate experience matches JD.

projectMatch:
- Explain how candidate projects match JD.

educationMatch:
- Explain whether education matches JD.

summary:
- Short explanation of ATS compatibility.

recommendations:
- 3-5 specific improvements for THIS JD.

Never invent anything.
`,
          },
        ],

        temperature: 0.1,
      });

    /* --------------------------------------------------------
       RAW RESPONSE
       -------------------------------------------------------- */

    const rawResponse =
      completion?.choices?.[0]?.message?.content;

    if (!rawResponse) {
      return res.status(500).json({
        success: false,
        message:
          "AI returned an empty ATS response.",
      });
    }

    console.log("RAW ATS RESPONSE:");
    console.log(rawResponse);

    /* --------------------------------------------------------
       PARSE JSON
       -------------------------------------------------------- */

    let atsResult;

    try {
      const jsonStart =
        rawResponse.indexOf("{");

      const jsonEnd =
        rawResponse.lastIndexOf("}") + 1;

      if (
        jsonStart === -1 ||
        jsonEnd <= jsonStart
      ) {
        throw new Error(
          "Invalid JSON returned by AI."
        );
      }

      const cleanJSON =
        rawResponse.substring(
          jsonStart,
          jsonEnd
        );

      atsResult = JSON.parse(cleanJSON);
    } catch (error) {
      console.error(
        "ATS JSON ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "AI returned invalid ATS JSON.",
      });
    }

    /* --------------------------------------------------------
       NORMALIZE ATS SCORE
       -------------------------------------------------------- */

    atsResult.atsScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          Number(atsResult.atsScore) || 0
        )
      )
    );

    /* --------------------------------------------------------
       NORMALIZE ARRAYS
       -------------------------------------------------------- */

    const atsArrayFields = [
      "matchedSkills",
      "missingSkills",
      "matchedKeywords",
      "missingKeywords",
      "recommendations",
    ];

    atsArrayFields.forEach((field) => {
      if (!Array.isArray(atsResult[field])) {
        atsResult[field] = [];
      }
    });

    /* --------------------------------------------------------
       NORMALIZE TEXT FIELDS
       -------------------------------------------------------- */

    if (
      typeof atsResult.experienceMatch !==
      "string"
    ) {
      atsResult.experienceMatch = "";
    }

    if (
      typeof atsResult.projectMatch !==
      "string"
    ) {
      atsResult.projectMatch = "";
    }

    if (
      typeof atsResult.educationMatch !==
      "string"
    ) {
      atsResult.educationMatch = "";
    }

    if (
      typeof atsResult.summary !==
      "string"
    ) {
      atsResult.summary = "";
    }

    /* --------------------------------------------------------
       SAVE ATS RESULT
       -------------------------------------------------------- */

    user.analysis.atsScore =
      atsResult.atsScore;

    user.analysis.atsDetails = {
      jobDescription:
        jobDescription.trim(),

      matchedSkills:
        atsResult.matchedSkills,

      missingSkills:
        atsResult.missingSkills,

      matchedKeywords:
        atsResult.matchedKeywords,

      missingKeywords:
        atsResult.missingKeywords,

      experienceMatch:
        atsResult.experienceMatch,

      projectMatch:
        atsResult.projectMatch,

      educationMatch:
        atsResult.educationMatch,

      summary:
        atsResult.summary,

      recommendations:
        atsResult.recommendations,
    };

    await user.save();

    console.log("=================================");
    console.log(
      "ATS MATCH SCORE:",
      atsResult.atsScore
    );

    console.log(
      "MATCHED SKILLS:",
      atsResult.matchedSkills.length
    );

    console.log(
      "MISSING SKILLS:",
      atsResult.missingSkills.length
    );

    console.log("=================================");

    return res.status(200).json({
      success: true,
      ats: atsResult,
    });
  } catch (error) {
    console.error(
      "ATS MATCH ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================================================
   GENERATE INTERVIEW QUESTIONS
   ============================================================ */

export const generateInterviewQuestions = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user.id
    );

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

        response_format: {
          type: "json_object",
        },

        messages: [
          {
            role: "system",

            content: `
You are an expert technical interviewer for software engineering placements.

Generate questions based ONLY on the candidate's actual resume.

Do not invent technologies or experience.

Return only valid JSON.
`,
          },

          {
            role: "user",

            content: `
Generate interview questions for this candidate.

Return exactly:

{
  "technicalQuestions": [],
  "projectQuestions": [],
  "HRQuestions": []
}

Technical questions:
- DSA
- programming
- technologies
- databases
- frameworks

Project questions:
- Only projects actually present in resume.

HR questions:
- Based on actual experience and profile.

Candidate Analysis:

${JSON.stringify(user.analysis)}
`,
          },
        ],

        temperature: 0.2,
      });

    const rawResponse =
      completion?.choices?.[0]?.message?.content;

    if (!rawResponse) {
      throw new Error(
        "Empty AI response"
      );
    }

    const jsonStart =
      rawResponse.indexOf("{");

    const jsonEnd =
      rawResponse.lastIndexOf("}") + 1;

    if (
      jsonStart === -1 ||
      jsonEnd <= jsonStart
    ) {
      throw new Error(
        "Invalid JSON response"
      );
    }

    const interviewQuestions =
      JSON.parse(
        rawResponse.substring(
          jsonStart,
          jsonEnd
        )
      );

    return res.status(200).json({
      success: true,
      questions:
        interviewQuestions,
    });
  } catch (error) {
    console.error(
      "GENERATE QUESTIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================================================
   EVALUATE INTERVIEW ANSWER
   ============================================================ */

export const evaluateAnswer = async (
  req,
  res
) => {
  try {
    const {
      question,
      answer,
    } = req.body;

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

        response_format: {
          type: "json_object",
        },

        messages: [
          {
            role: "system",

            content: `
You are an expert software engineering interviewer.

Evaluate the candidate's answer fairly.

Score must be an INTEGER from 0 to 10.

Consider:
- correctness
- technical understanding
- completeness
- clarity
- relevance
- depth

Return only valid JSON.
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

Question:
${question}

Candidate Answer:
${answer}
`,
          },
        ],

        temperature: 0.1,
      });

    const rawResponse =
      completion?.choices?.[0]?.message?.content;

    if (!rawResponse) {
      throw new Error(
        "Empty AI response"
      );
    }

    const jsonStart =
      rawResponse.indexOf("{");

    const jsonEnd =
      rawResponse.lastIndexOf("}") + 1;

    if (
      jsonStart === -1 ||
      jsonEnd <= jsonStart
    ) {
      throw new Error(
        "Invalid JSON response"
      );
    }

    const evaluation =
      JSON.parse(
        rawResponse.substring(
          jsonStart,
          jsonEnd
        )
      );

    evaluation.score = Math.max(
      0,
      Math.min(
        10,
        Number(evaluation.score) || 0
      )
    );

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    if (!Array.isArray(user.interviews)) {
      user.interviews = [];
    }

    user.interviews.push({
      question,
      answer,
      score: evaluation.score,
      feedback:
        evaluation.feedback || "",
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

/* ============================================================
   GET INTERVIEW HISTORY
   ============================================================ */

export const getInterviewHistory = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      ).select("interviews");

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
        user.interviews || [],
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