# PlacementPilot AI

PlacementPilot AI is a full-stack, AI-powered placement preparation platform for students. It analyzes resumes, generates and evaluates mock interviews, and builds a personalized career roadmap using large language models.

## Overview

Students often struggle to know where they stand before campus placements — whether their resume is ATS-friendly, what skills they're missing, and how they'd perform in an actual interview. PlacementPilot AI addresses this by combining resume analysis, AI-generated mock interviews, and skill-gap roadmaps into a single dashboard.

## Features

- **Authentication** — JWT-based signup and login
- **Resume Analysis** — Upload a resume (PDF) and get an AI-generated score, ATS compatibility score, strengths, weaknesses, and missing skills
- **AI Mock Interviews** — Practice with AI-generated technical, project-based, and HR questions, with real-time AI evaluation and feedback on each answer
- **Interview History** — Review past interview attempts, scores, and feedback
- **Career Roadmap** — Personalized short-term, mid-term, and long-term roadmap generated from resume analysis
- **Profile Management** — Maintain college, branch, CGPA, skills, and social/coding profile links (GitHub, LinkedIn, LeetCode)
- **Dashboard** — Centralized view of resume score, ATS score, interview score, and overall placement readiness
- **Search** — Quick navigation across app pages plus search across personal data (skills, interview questions, roadmap items)

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- tsparticles

**Backend**
- Node.js
- Express 5
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing
- Multer for file uploads
- pdfjs-dist for PDF parsing

**AI**
- Groq SDK (LLM-powered resume analysis, question generation, and answer evaluation)

## Project Structure

```
PlacementPilot-AI/
├── client/          Next.js frontend
│   ├── app/         Pages (App Router)
│   ├── components/  Reusable UI components
│   ├── lib/         Utility functions
│   └── services/    API client (axios)
└── server/          Express backend
    ├── config/      Database configuration
    ├── controllers/ Route handlers
    ├── middleware/  Auth and upload middleware
    ├── models/      Mongoose schemas
    ├── routes/      API routes
    └── services/    AI service integration
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- A MongoDB Atlas cluster (or local MongoDB instance)
- A Groq API key

### Installation

Clone the repository:

```bash
git clone https://github.com/Jiya-builds/PlacementPilot-AI.git
cd PlacementPilot-AI
```

Install dependencies for both the client and server:

```bash
cd client
npm install

cd ../server
npm install
```

### Environment Variables

Create a `.env` file inside the `server` directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:3000
```

If deploying the frontend separately, create a `.env.local` file inside the `client` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Running Locally

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in a separate terminal:

```bash
cd client
npm run dev
```

The app will be available at `http://localhost:3000`, and the API at `http://localhost:5000`.

## API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/signup` | POST | Register a new user |
| `/api/auth/login` | POST | Authenticate and receive a JWT |
| `/api/auth/profile` | GET | Fetch the logged-in user's profile |
| `/api/auth/profile` | PUT | Update profile details |
| `/api/ai/resume-analysis` | GET | Retrieve AI resume analysis |
| `/api/ai/generate-questions` | GET | Generate mock interview questions |
| `/api/ai/evaluate-answer` | POST | Submit an answer for AI evaluation |
| `/api/ai/interview-history` | GET | Retrieve past interview attempts |

## Deployment

The frontend is designed to be deployed on Vercel and the backend on Render (or any Node.js-compatible host). Set `NEXT_PUBLIC_API_URL` on the frontend to point to the deployed backend, and `CLIENT_URL` on the backend to the deployed frontend URL for CORS to work correctly.

## License

This project is licensed under the terms of the LICENSE file included in this repository.
