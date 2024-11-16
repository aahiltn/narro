import { useState } from "react";

const SPECIAL_CHARACTERS = [
  "á",
  "à",
  "ã",
  "â",
  "ä",
  "å",
  "æ",
  "é",
  "è",
  "ê",
  "ë",
  "í",
  "ì",
  "î",
  "ï",
  "ñ",
  "ó",
  "ò",
  "õ",
  "ô",
  "ö",
  "ø",
  "ú",
  "ù",
  "û",
  "ü",
  "ý",
  "ÿ",
  "ß",
  "¿",
  "¡",
  "°",
  "±",
  "×",
  "÷",
  "≠",
  "≈",
  "≤",
  "≥",
  "Ω",
  "π",
  "∑",
  "√",
  "∫",
  "∞",
  "α",
  "β",
  "γ",
  "δ",
  "θ",
  "λ",
  "μ",
  "σ",
  "φ",
  "ω",
];

interface SpecialCharactersProps {
  onCharacterClick: (char: string) => void;
}

export function SpecialCharacters({
  onCharacterClick,
}: SpecialCharactersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 border rounded hover:bg-gray-100"
      >
        Ω
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 p-2 bg-white border rounded shadow-lg grid grid-cols-8 gap-1">
          {SPECIAL_CHARACTERS.map((char) => (
            <button
              key={char}
              onClick={() => {
                onCharacterClick(char);
                setIsOpen(false);
              }}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
            >
              {char}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
