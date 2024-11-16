import { useRouter } from "next/router";
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
import { Exam } from "@prisma/client";

export default function ExamPage() {
  const router = useRouter();
  const { id } = router.query;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [isPreview, setIsPreview] = useState(false);
  const [exam, setExam] = useState<Exam>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    getExam(id as string)
      .then((data) => {
        setExam(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{exam.name}</h1>
      <div className="relative">
        <Timer
          duration={exam.timeLimit ? exam.timeLimit.getTime() : 0}
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
