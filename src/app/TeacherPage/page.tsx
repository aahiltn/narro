"use client";

import { useEffect, useState } from "react";
import { useGetUnits, useCreateUnit } from "@/hooks/useUnits";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface UnitFormData {
  language: string;
  keywords: string[];
  teacherNotes: string;
  classSectionId: string;
  teacherId: string;
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
  const {
    units,
    loading: fetchLoading,
    error: fetchError,
    fetchUnits,
  } = useGetUnits();
  const {
    createUnit,
    loading: createLoading,
    error: createError,
  } = useCreateUnit();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<UnitFormData>({});
  const [currentKeyword, setCurrentKeyword] = useState("");

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataWithIds = {
        ...formData,
        classSectionId: "your_class_section_id",
        teacherId: "your_teacher_id",
      };
      await createUnit(dataWithIds);
      setIsModalOpen(false);
      setFormData({});
      fetchUnits();
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

  if (fetchLoading || createLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (fetchError || createError) {
    return (
      <div className="text-red-500">
        Error: {(fetchError || createError)?.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Units</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
        >
          +
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units?.map((unit) => (
          <div
            key={unit.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-bold mb-2">{unit.language}</h3>
            <p className="text-sm text-gray-600 mb-2">
              Keywords: {unit.keywords.join(", ")}
            </p>
            <p className="text-sm">{unit.teacherNotes}</p>
          </div>
        ))}
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
