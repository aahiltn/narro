"use client"

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getExam } from "@/api/dal/exams";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Clock } from 'lucide-react';
import { LoadingSpinner } from "@/app/components/StudentView/LoadingSpinner";
import { ErrorMessage } from "@/app/components/StudentView/ErrorMessage";
import { PreviewPage } from "@/app/components/StudentView/PreviewPage";
import { MediaWindow } from "@/app/components/StudentView/MediaWindow";
import { Timer } from "@/app/components/StudentView/Timer";

export default function ExamPage() {
  const router = useRouter();
  const { id } = router.query;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [isPreview, setIsPreview] = useState(false);
  const [exam, setExam] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchExam = async () => {
      try {
        setIsLoading(true);
        const data = await getExam(id as string);
        setExam(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  const handleTimeUp = () => {
    setIsPreview(true);
  };

  const handleResponseChange = (questionIndex: number, response: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: response,
    }));
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!exam) return null;

  if (isPreview) {
    return (
      <PreviewPage
        exam={exam}
        responses={responses}
        canGoBack={!isTimeUp}
        onBack={() => setIsPreview(false)}
      />
    );
  }

  const progress = ((currentQuestion + 1) / exam.questions.length) * 100;
  const currentQuestionData = exam.questions[currentQuestion];

  return (
    <div className="flex min-h-screen">
      {/* Left sidebar */}
      <aside className="w-64 border-r bg-white p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2">
            <Clock className="h-4 w-4" />
            <Timer
              duration={exam.duration}
              onTimeUp={handleTimeUp}
            />
          </div>
        </div>

        <nav className="space-y-2">
          {exam.questions.map((question, index) => (
            <button
              key={index}
              className={`w-full rounded-lg px-4 py-2 text-left text-sm ${
                currentQuestion === index
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setCurrentQuestion(index)}
            >
              Question {index + 1}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-2xl font-bold">{exam.name}</h1>

          <div className="mb-8">
            <MediaWindow questionId={currentQuestionData.id} />
          </div>

          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">
              {currentQuestionData.prompt}
            </h2>
            {/* Add hint if available in your data structure */}
          </div>

          <Textarea
            value={responses[currentQuestion] || ""}
            onChange={(e) => handleResponseChange(currentQuestion, e.target.value)}
            placeholder="Type your answer here..."
            className="mb-8 min-h-[200px]"
          />

          <div className="flex items-center justify-between">
            <Button 
              variant="outline"
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            {currentQuestion < exam.questions.length - 1 ? (
              <Button 
                onClick={() => setCurrentQuestion((prev) => 
                  Math.min(exam.questions.length - 1, prev + 1)
                )}
              >
                Next
              </Button>
            ) : (
              <Button onClick={() => setIsPreview(true)}>
                Review Answers
              </Button>
            )}
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
