"use client";

import { useState, useEffect } from "react";
import { getExam } from "@/api/dal/exams";
import { NavButtons } from "@/app/components/StudentView/NavButtons";
import { ProgressBar } from "@/app/components/StudentView/ProgressBar";
import { Timer } from "@/app/components/StudentView/Timer";
import { MediaWindow } from "@/app/components/StudentView/MediaWindow";
import { SpecialCharacters } from "@/app/components/StudentView/SpecialCharacters";
import { LoadingSpinner } from "@/app/components/StudentView/LoadingSpinner";
import { ErrorMessage } from "@/app/components/StudentView/ErrorMessage";
import { PreviewPage } from "@/app/components/StudentView/PreviewPage";

export default function ExamPage(prop: { id: string }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [isPreview, setIsPreview] = useState(false);
  const [exam, setExam] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!prop.id) return;
    console.log("fetching exam");

    const fetchExam = async () => {
      try {
        setIsLoading(true);
        const data = await getExam(prop.id as string);
        setExam(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExam();
    console.log("done fetching exam");
  }, [prop.id]);

  const handleTimeUp = () => {
    setIsPreview(true);
  };

  const handleResponseChange = (questionIndex: number, response: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: response,
    }));
  };

  // if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  // if (!exam) return null;

  if (isPreview) {
    return (
      <PreviewPage
        exam={exam}
        responses={responses}
        canGoBack={true}
        onBack={() => setIsPreview(false)}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{exam.name}</h1>

      <div className="relative">
        <Timer
          duration={exam.duration}
          onTimeUp={handleTimeUp}
          className="absolute top-4 right-4"
        />

        <MediaWindow questionId={exam.questions[currentQuestion].id} />
      </div>

      <ProgressBar
        total={exam.questions.length}
        current={currentQuestion}
        onChange={setCurrentQuestion}
      />

      <div className="mt-4">
        <SpecialCharacters
          onCharacterClick={(char) => {
            const response = responses[currentQuestion] || "";
            handleResponseChange(currentQuestion, response + char);
          }}
        />

        <textarea
          value={responses[currentQuestion] || ""}
          onChange={(e) =>
            handleResponseChange(currentQuestion, e.target.value)
          }
          className="w-full h-32 p-2 border rounded"
        />
      </div>

      <NavButtons
        onPrev={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
        onNext={() =>
          setCurrentQuestion((prev) =>
            Math.min(exam.questions.length - 1, prev + 1)
          )
        }
        showPrev={currentQuestion > 0}
        showNext={currentQuestion < exam.questions.length - 1}
        onFinish={() => setIsPreview(true)}
      />
    </div>
  );
}
