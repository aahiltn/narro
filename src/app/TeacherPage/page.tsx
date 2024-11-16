"use client";

import { useEffect, useState } from "react";
import { useCreateUnit } from "@/hooks/useUnits";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { getUnits } from "@/api/dal/units";
import Link from "next/link";

interface UnitFormData {
  name: string;
  language: string;
  keywords: string[];
  teacherNotes: string;
}

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Russian",
  "Arabic",
  "Hindi",
];

export default function TeacherUnitsPage() {
  const [units, setUnits] = useState([]);
  const {
    createUnit,
    loading: createLoading,
    error: createError,
  } = useCreateUnit();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<UnitFormData>({} as UnitFormData);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [questionLoading, setQuestionLoading] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    getUnits().then((res) => {
      setUnits(res);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting form data:", formData);
      const submitData = {
        name: formData.name,
        language: formData.language,
        keywords: formData.keywords || [],
        teacherNotes: formData.teacherNotes,
      };
      console.log("Submit data:", submitData);
      await createUnit(submitData);
      await getUnits().then((res) => {
        setUnits(res);
      });
      setIsModalOpen(false);
      setFormData({} as UnitFormData);
    } catch (error) {
      console.error("Failed to create unit:", error);
    }
  };

  const handleKeywordSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (currentKeyword.trim() && currentKeyword.length <= 20) {
        const newKeywords = [
          ...(formData.keywords || []),
          currentKeyword.trim(),
        ];
        setFormData({ ...formData, keywords: newKeywords });
        setCurrentKeyword("");
      }
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    const newKeywords = (formData.keywords || []).filter(
      (keyword) => keyword !== keywordToRemove
    );
    setFormData({ ...formData, keywords: newKeywords });
  };

  const handleGenerateQuestion = async (unit: any) => {
    try {
      setQuestionLoading((prev) => ({ ...prev, [unit.id]: true }));

      const response = await fetch("/api/questions/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: unit.keywords,
          unitDescription: unit.teacherNotes,
          language: unit.language,
        }),
      });

      const data = await response.json();

      if (data.success && data.data.id) {
        window.location.href = `/question/${data.data.id}`;
      } else {
        console.error("Failed to generate question:", data.error);
      }
    } catch (error) {
      console.error("Error generating question:", error);
    } finally {
      setQuestionLoading((prev) => ({ ...prev, [unit.id]: false }));
    }
  };

  if (createLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (createError) {
    return <div className="text-red-500">Error: {createError?.message}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <img src="/Narro-logo.svg" alt="Narro" className="h-8 mb-8" />
          <nav className="space-y-2">
            <Link
              href="/units"
              className="flex items-center space-x-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600"
            >
              <span>Units</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Units</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add New Unit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units?.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {unit.name}
                      </h3>
                      <p className="text-sm text-gray-500">{unit.language}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {unit.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {unit.teacherNotes}
                    </p>
                    <button
                      onClick={() => handleGenerateQuestion(unit)}
                      disabled={questionLoading[unit.id]}
                      className="w-full mt-4 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {questionLoading[unit.id] ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Generate Question"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black opacity-30" />
          <Dialog.Panel className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <Dialog.Title className="text-lg font-bold mb-4">
              Create New Unit
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Unit Name
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Language
                </label>
                <select
                  value={formData.language || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                  className="w-full border rounded p-2 bg-white"
                  required
                >
                  <option value="">Select a language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Keywords
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.keywords?.map((keyword) => (
                    <span
                      key={keyword}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:text-blue-900"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={currentKeyword}
                  onChange={(e) => {
                    if (e.target.value.length <= 20) {
                      setCurrentKeyword(e.target.value);
                    }
                  }}
                  onKeyDown={handleKeywordSubmit}
                  placeholder="Type and press Enter to add keyword (max 20 chars)"
                  className="w-full border rounded p-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {20 - currentKeyword.length} characters remaining
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Teacher Notes
                </label>
                <textarea
                  value={formData.teacherNotes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherNotes: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Unit
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
