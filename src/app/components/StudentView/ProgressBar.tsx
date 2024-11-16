interface ProgressBarProps {
  total: number;
  current: number;
  onChange: (index: number) => void;
}

export function ProgressBar({ total, current, onChange }: ProgressBarProps) {
  return (
    <div className="flex gap-2 my-4">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onChange(index)}
          className={`
            h-2 flex-1 rounded-full transition-all
            ${
              current === index
                ? "bg-blue-500"
                : "bg-gray-200 hover:bg-gray-300"
            }
          `}
          aria-label={`Question ${index + 1}`}
        />
      ))}
    </div>
  );
}
