import { TeacherCreate } from "./types";

const BASE_URL = "/api/teachers";

export const teacherApi = {
  getAll: () => fetch(BASE_URL).then((res) => res.json()),

  create: (data: TeacherCreate) =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
};
