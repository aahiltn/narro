import { useRouter } from "next/router";
import { createExam } from "@/api/dal/exams";
import { Exam } from "@prisma/client";

interface PreviewPageProps {
  exam: Exam;
  responses: Record<number, string>;
  canGoBack: boolean;
  onBack: () => void;
}

export function PreviewPage({
  exam,
  responses,
  canGoBack,
  onBack,
}: PreviewPageProps) {
  const router = useRouter();

  const handleSubmit = async () => {
    await createExam(exam);
    router.push("/student/dashboard");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Review Your Answers</h1>
      {exam.questions.map(
        (question: { id: string; text: string }, index: number) => (
          <div key={question.id} className="mb-4 p-4 border rounded">
            <h2 className="font-bold">Question {index + 1}</h2>
            <p className="mt-2">{responses[index] || "No answer provided"}</p>
          </div>
        )
      )}

      <div className="flex justify-between mt-4">
        {canGoBack && (
          <button onClick={onBack} className="px-4 py-2 bg-gray-200 rounded">
            Back to Exam
          </button>
        )}

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit Exam
        </button>
      </div>
    </div>
  );
}
