import { QuestionCreate } from "./types";

const BASE_URL = "/api/questions";

export const questionApi = {
  getAll: () => fetch(BASE_URL).then((res) => res.json()),

  create: (data: QuestionCreate) =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
};
