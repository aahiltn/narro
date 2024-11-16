"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Clock } from "lucide-react";

interface ExamPageProps {
  question: {
    prompt: string;
    image?: string;
  };
}

export default function ExamPage({ question }: ExamPageProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answer, setAnswer] = useState("");
  const totalQuestions = 8;
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="flex min-h-screen">
      {/* Left sidebar */}
      <aside className="w-64 border-r bg-white p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2">
            <Clock className="h-4 w-4" />
            <span className="font-medium">12:30</span>
          </div>
        </div>
        <nav className="space-y-2">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <button
              key={i + 1}
              className={`w-full rounded-lg px-4 py-2 text-left text-sm ${
                currentQuestion === i + 1
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setCurrentQuestion(i + 1)}
            >
              Question {i + 1}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-2xl font-bold">Spanish 101 Test</h1>
          {question.image && (
            <div className="mb-8">
              <img
                src={question.image}
                alt="Test question image"
                className="h-64 w-full rounded-lg object-cover"
              />
            </div>
          )}
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">{question.prompt}</h2>
            <p className="text-sm text-gray-500">
              hint: Describe the colors, objects, actions, people, and the place
              you see in the image.
            </p>
          </div>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="mb-8 min-h-[200px]"
          />
          <div className="flex items-center justify-between">
            <Button variant="outline">Save</Button>
            <Button
              onClick={() =>
                setCurrentQuestion((prev) => Math.min(prev + 1, totalQuestions))
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 w-full">
        <Progress value={progress} className="h-2 rounded-none" />
      </div>
    </div>
  );
}
