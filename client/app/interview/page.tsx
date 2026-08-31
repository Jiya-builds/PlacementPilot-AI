"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

type Feedback = {
  score: number;
  feedback: string;
  improvements: string;
};

export default function InterviewPage() {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const getQuestionText = (q: any) =>
    typeof q === "string" ? q : q?.question ?? "";

  const generateQuestion = async () => {
    try {
      setLoading(true);

      const res = await api.get("/ai/generate-questions");

      const data = res.data.questions;

      const allQuestions = [
        ...(data.technicalQuestions || []),
        ...(data.projectQuestions || []),
        ...(data.HRQuestions || []),
      ];

      setQuestions(allQuestions);
      setCurrent(0);
      setQuestion(getQuestionText(allQuestions[0]));
      setAnswer("");
      setFeedback(null);
      setScores([]);
      setStarted(true);
      setFinished(false);
    } catch (error: any) {
      console.log("GENERATE QUESTIONS ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please write answer");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/ai/evaluate-answer", {
        question,
        answer,
      });

      const evaluation = res.data.evaluation;

      setFeedback(evaluation);
      setScores((prev) => [...prev, evaluation.score]);
    } catch (error: any) {
      console.log("EVALUATE ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const goToNextQuestion = () => {
    const nextIndex = current + 1;

    if (nextIndex >= questions.length) {
      // No more questions — show the completion summary
      setFinished(true);
      return;
    }

    setCurrent(nextIndex);
    setQuestion(getQuestionText(questions[nextIndex]));
    setAnswer("");
    setFeedback(null);
  };

  const isLastQuestion = current === questions.length - 1;

  return (
    <div className="min-h-screen bg-[var(--pp-bg)] p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-[var(--pp-text)]">AI Mock Interview 🤖</h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="text-[var(--pp-text-muted)] hover:text-[var(--pp-text)] text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>

      {!finished && (
        <button
          onClick={generateQuestion}
          disabled={loading}
          className="bg-[var(--pp-ink)] px-6 py-3 rounded-xl text-[var(--pp-text)] disabled:opacity-60"
        >
          {loading && !started
            ? "Generating..."
            : started
            ? "Restart Interview"
            : "Start Interview"}
        </button>
      )}

      {started && !finished && question && (
        <div className="mt-8 max-w-3xl bg-[var(--pp-panel)] border border-[var(--pp-line)] rounded-3xl p-8">
          <h2 className="text-[var(--pp-ink)] mb-4">
            Question {current + 1} / {questions.length}
          </h2>

          <p className="text-xl text-[var(--pp-text)]">{question}</p>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            disabled={!!feedback}
            className="mt-6 w-full h-40 bg-black/20 border border-[var(--pp-line)] rounded-xl p-4 text-[var(--pp-text)] disabled:opacity-60"
          />

          {!feedback ? (
            <button
              type="button"
              onClick={submitAnswer}
              disabled={loading}
              className="mt-5 bg-[var(--pp-ink-soft)] px-6 py-3 rounded-xl text-[var(--pp-text)] cursor-pointer hover:bg-[var(--pp-ink)] disabled:opacity-60"
            >
              {loading ? "Evaluating..." : "Submit Answer"}
            </button>
          ) : (
            <button
              type="button"
              onClick={goToNextQuestion}
              className="mt-5 bg-[var(--pp-ink)] px-6 py-3 rounded-xl text-[var(--pp-text)] cursor-pointer hover:bg-[var(--pp-ink-soft)]"
            >
              {isLastQuestion ? "Finish Interview" : "Next Question →"}
            </button>
          )}
        </div>
      )}

      {feedback && !finished && (
        <div className="mt-8 max-w-3xl bg-[var(--pp-panel)] border border-[var(--pp-line)] rounded-3xl p-8">
          <h2 className="text-2xl text-[var(--pp-text)] font-bold">AI Feedback</h2>

          <p className="text-[var(--pp-pass)] mt-4 text-xl">
            Score : {feedback.score}/10
          </p>

          <p className="text-[var(--pp-text-muted)] mt-4">{feedback.feedback}</p>

          <p className="text-[var(--pp-text-muted)] mt-4">
            Improvement:
            <br />
            {feedback.improvements}
          </p>
        </div>
      )}

      {finished && scores.length > 0 && (
        <div className="mt-8 max-w-3xl bg-[var(--pp-ink)]/10 border border-[var(--pp-ink)]/25 rounded-3xl p-8">
          <h2 className="text-2xl text-[var(--pp-text)] font-bold">
            Interview Completed 🎉
          </h2>

          <p className="text-[var(--pp-text-muted)] mt-4">
            Questions Attempted: {scores.length} / {questions.length}
          </p>

          <p className="text-[var(--pp-text-muted)] mt-2 text-xl">
            Average Score :{" "}
            {(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)}
            /10
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={generateQuestion}
              className="bg-[var(--pp-ink)] px-6 py-3 rounded-xl text-[var(--pp-text)] hover:bg-[var(--pp-ink-soft)]"
            >
              Practice Again
            </button>

            <button
              onClick={() => router.push("/history")}
              className="bg-[var(--pp-panel-raised)] border border-[var(--pp-line)] px-6 py-3 rounded-xl text-[var(--pp-text)] hover:bg-[var(--pp-line)]"
            >
              View History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
