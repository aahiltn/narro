interface NavButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
  showPrev: boolean;
  showNext: boolean;
}

export function NavButtons({
  onPrev,
  onNext,
  onFinish,
  showPrev,
  showNext,
}: NavButtonsProps) {
  return (
    <div className="flex justify-between mt-4">
      {showPrev && (
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Previous
        </button>
      )}

      {showNext ? (
        <button
          onClick={onNext}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next
        </button>
      ) : (
        <button
          onClick={onFinish}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Review Answers
        </button>
      )}
    </div>
  );
}
