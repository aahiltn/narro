"use client";
import { useState } from "react";
import { mockUnits } from "@/types/question";
import { createQuestionFromKeywords } from "@/api/question-gen";

export default function TestQuestions() {
  const [selectedUnit, setSelectedUnit] = useState(mockUnits[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuestion = async () => {
    try {
      setLoading(true);
      setError(null);
      const question = await createQuestionFromKeywords({
        keywords: selectedUnit.keywords,
        unitDescription: selectedUnit.description,
        language: selectedUnit.language,
      });
      setResult(question);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate question"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Question Generation</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Unit</label>
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => setSelectedUnit(mockUnits[parseInt(e.target.value)])}
        >
          {mockUnits.map((unit, index) => (
            <option key={unit.title} value={index}>
              {unit.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Selected Unit Details:</h2>
        <p>
          <strong>Description:</strong> {selectedUnit.description}
        </p>
        <p>
          <strong>Keywords:</strong> {selectedUnit.keywords.join(", ")}
        </p>
      </div>

      <button
        onClick={handleGenerateQuestion}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
      >
        {loading ? "Generating..." : "Generate Question"}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {result && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-4">Generated Question:</h2>
          <img
            src={result.image}
            alt="Generated question image"
            className="w-full max-w-md mb-4 rounded"
          />
          <p>
            <strong>Prompt:</strong> {result.prompt}
          </p>
        </div>
      )}
    </main>
  );
}
