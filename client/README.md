# 🚀 PlacementPilot AI

An AI-powered placement preparation platform that helps students analyze their resumes, identify skill gaps, generate personalized career roadmaps, and prepare for technical interviews using Generative AI.

---

## 🌟 Overview

PlacementPilot AI is an intelligent career assistant designed for students preparing for software engineering placements.

The platform uses AI to analyze resumes, evaluate ATS compatibility, suggest improvements, generate learning roadmaps, recommend projects, and conduct AI-based interview preparation.

---

## ✨ Features

### 📄 AI Resume Analyzer

- Upload your resume in PDF format
- Extracts resume content automatically
- Generates AI-based resume evaluation
- Provides:
  - Resume Score
  - ATS Compatibility Score
  - Strengths
  - Weaknesses
  - Missing Skills
  - Improvement Suggestions


### 🛣️ Personalized Career Roadmap

AI generates a customized roadmap based on your profile:

- Short Term Goals
- Mid Term Goals
- Long Term Goals

Helping students understand what skills and technologies they should learn next.

---

### 💡 Skill Gap Analysis

Identifies missing technical skills required for industry roles.

Provides recommendations like:

- Backend Development
- Cloud Technologies
- DevOps Tools
- Database Management
- Machine Learning Skills

---

### 🚀 AI Project Recommendations

Suggests real-world projects according to the candidate's profile.

Each project includes:

- Project Title
- Description
- Required Technologies


---

### 🤖 AI Interview Preparation

Generate personalized interview questions based on resume:

- Technical Questions
- Project-Based Questions
- HR Questions

AI also evaluates candidate answers and provides feedback.

---

## 🏗️ Tech Stack

### Frontend

- Next.js
- React.js
- TypeScript
- Tailwind CSS
- Lucide React Icons


### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose


### AI & APIs

- Groq LLM API
- Llama 3.1 Model
- PDF.js for Resume Extraction


### Tools

- Git & GitHub
- VS Code
- Postman


---

# 📂 Project Structure

```
PlacementPilot-AI
│
├── client
│   ├── app
│   ├── components
│   ├── services
│   └── public
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   └── server.js
│
└── README.md
```

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/Jiya-builds/PlacementPilot-AI.git
```

---

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## Backend Setup

```bash
cd server

npm install

npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

# 🔐 Environment Variables

Create `.env` file inside server folder:

```
MONGO_URI=your_mongodb_connection_string

GROQ_API_KEY=your_groq_api_key

JWT_SECRET=your_secret_key
```

---

# 📸 Application Workflow

```
User
 |
 | Upload Resume
 ↓
PDF Text Extraction
 |
 ↓
AI Resume Analysis
 |
 ↓
MongoDB Storage
 |
 ↓
Dashboard
 |
 ├── Resume Score
 ├── Skill Analysis
 ├── Career Roadmap
 ├── Project Suggestions
 └── Interview Preparation
```

---

# 🎯 Future Improvements

- Real-time AI mock interviews
- Voice-based interview system
- Job recommendation engine
- LinkedIn profile analyzer
- Resume builder
- Placement statistics dashboard

---

# 🧑‍💻 Author

**Jiya**

B.Tech Computer Science Engineering Student

Interested in:
- Software Development
- Artificial Intelligence
- Machine Learning
- Full Stack Development


---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.
