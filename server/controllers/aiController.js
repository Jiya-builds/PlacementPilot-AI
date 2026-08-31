import groq from "../services/aiService.js";
import fs from "fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import User from "../models/User.js";

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

    const jobDescription = (user.jobDescription || "").trim();

    const jobMatchInstructions = jobDescription
      ? `

The candidate has also provided a target job description. Compare the
resume against it and additionally include a "jobMatch" object in the
JSON with this shape:

"jobMatch": {
  "matchScore": 8,
  "matchedSkills": [],
  "missingForJob": [],
  "summary": ""
}

Where matchScore is out of 10 (how well the resume fits this specific
job), matchedSkills are resume skills that align with the job
description, missingForJob are skills/requirements from the job
description not evident in the resume, and summary is a 1-2 sentence
verdict.

Job Description:
${jobDescription.substring(0, 3000)}
`
      : "";

    const completion = await groq.chat.completions.create({
     model:"openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content:
          "You are an expert resume analyzer for software engineering placements."
        },

        {
          role: "user",
          content: `

Analyze this resume for a software engineering placement candidate.

Return ONLY valid JSON.
No markdown.
No explanations.
No code blocks.

Use exactly this format:

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

IMPORTANT:
- roadmap shortTerm, midTerm and longTerm MUST contain at least 3 items each.
- Do not return empty arrays for roadmap.
- suggestedProjects must contain title, description and technologies.
${jobMatchInstructions}
Resume:

${text.substring(0,4000)}
`
        }
      ],

      temperature: 0.2,
    });


    const analysis = completion.choices[0].message.content;
    console.log("AI RESPONSE:", analysis);
       const cleanJSON = analysis
  .replaceAll("```json", "")
  .replaceAll("```", "")
  .trim();

  const finalAnalysis = JSON.parse(cleanJSON);
  if (Array.isArray(finalAnalysis.roadmap)) {
  if(Array.isArray(finalAnalysis.roadmap)){

finalAnalysis.roadmap = {
  shortTerm: finalAnalysis.roadmap[0]?.steps || [],
  midTerm: finalAnalysis.roadmap[1]?.steps || [],
  longTerm: finalAnalysis.roadmap[2]?.steps || []
};

}

finalAnalysis.roadmap ??= {
  shortTerm:[],
  midTerm:[],
  longTerm:[]
};
}
  finalAnalysis.strengths ??= [];
finalAnalysis.weaknesses ??= [];
finalAnalysis.missingSkills ??= [];

finalAnalysis.roadmap ??= {
shortTerm:[],
midTerm:[],
longTerm:[]
};

finalAnalysis.suggestedProjects ??= [];
finalAnalysis.suggestedProjects =
(finalAnalysis.suggestedProjects || []).map(project => ({
  title: project.title || "",
  description: project.description || "",
  technologies: project.technologies || project.skills || []
}));

if(!Array.isArray(finalAnalysis.suggestedProjects)){
finalAnalysis.suggestedProjects=[];
}
finalAnalysis.suggestedProjects =
finalAnalysis.suggestedProjects.map(project=>{

if(typeof project==="string"){

return{
title:project,
description:"",
technologies:[]
};

}

return{
title:project.title || "",
description:project.description || "",
technologies:project.technologies || []
};

});

  finalAnalysis.suggestedProjects =
finalAnalysis.suggestedProjects.map((project)=>{

  if(typeof project === "string"){
    return {
      title: project,
      description: "",
      technologies:[]
    };
  }

  return project;

});

finalAnalysis.jobMatch ??= null;
if (finalAnalysis.jobMatch) {
  finalAnalysis.jobMatch.matchedSkills ??= [];
  finalAnalysis.jobMatch.missingForJob ??= [];
  finalAnalysis.jobMatch.summary ??= "";
}

    user.analysis = finalAnalysis;

await user.save();

return res.status(200).json({
  success: true,
  analysis: finalAnalysis
});


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }
};

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
     model:"openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content:
          "You are an expert technical interviewer for software engineering placements."
        },

        {
          role: "user",
          content: `
Generate interview questions based on this candidate profile.

Return ONLY valid JSON.




Do not add markdown.
Do not add explanations.
Do not use ** symbols.
Start response directly with { and end with }.

Generate:
- technicalQuestions
- projectQuestions
- HRQuestions

Candidate Analysis:

${JSON.stringify(user.analysis)}
`
        }
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

console.log("CLEAN JSON:", cleanJSON);
const interviewQuestions = JSON.parse(cleanJSON);

return res.status(200).json({
  success: true,
  questions: interviewQuestions,
});


  } catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};

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
     model:"openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content:
          "You are an expert technical interviewer evaluating software engineering candidates."
        },

        {
          role: "user",
          content: `
Evaluate this interview answer.

Return ONLY VALID JSON.

Do NOT write markdown.
Do NOT use ** or bullets.
Do NOT explain anything outside JSON.

Format:

{
  "score": 8,
  "feedback": "....",
  "improvements": "...."
}

Question:
${question}

Candidate Answer:
${answer}
`
        }
      ],

      temperature:0.2,
    });


    const response = completion.choices[0].message.content;


    const jsonStart = response.indexOf("{");
const jsonEnd = response.lastIndexOf("}") + 1;

if(jsonStart === -1 || jsonEnd === 0){

return res.status(500).json({
success:false,
message:"AI returned invalid JSON",
raw:response
});

}

const cleanJSON = response.substring(jsonStart,jsonEnd);

const evaluation = JSON.parse(cleanJSON);

// Save in user history
const user = await User.findById(req.user.id);

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


  } catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};

export const getInterviewHistory = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select("interviews");

    if (!user) {
      return res.status(404).json({
        success:false,
        message:"User not found"
      });
    }


    res.status(200).json({
      success:true,
      interviews:user.interviews
    });


  } catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};