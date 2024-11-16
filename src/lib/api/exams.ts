import { ExamCreate } from "./types";

const BASE_URL = "/api/exams";

export const examApi = {
  getAll: () => fetch(BASE_URL).then((res) => res.json()),

  create: (data: ExamCreate) =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
};
