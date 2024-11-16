import { LoadingSpinner } from "@/app/components/StudentView/LoadingSpinner";
import { ErrorMessage } from "@/app/components/StudentView/ErrorMessage";
import { useState, useTransition } from "react";
import { useEffect } from "react";
import { generateImageFromKeywords } from "@/api/image-gen";

interface MediaWindowProps {
  questionId: string;
}

export function MediaWindow({ questionId }: MediaWindowProps) {
  const [isPending, startTransition] = useTransition();
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!questionId) return;

    startTransition(async () => {
      try {
        const url = (await generateImageFromKeywords(questionId)).imageUrl;
        const desc = (await generateImageFromKeywords(questionId)).description;
        setMediaUrl(url);
        setDescription(desc);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to load media:", err);
      }
    });
  }, [questionId]);

  if (isPending) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!mediaUrl) return null;

  return (
    <div className="w-full aspect-video bg-gray-100 rounded overflow-hidden">
      <img
        src={mediaUrl}
        alt="AI Generated Content"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
