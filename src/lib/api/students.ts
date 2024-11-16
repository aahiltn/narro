import { StudentCreate } from "./types";

const BASE_URL = "/api/students";

export const studentApi = {
  getAll: () => fetch(BASE_URL).then((res) => res.json()),

  create: (data: StudentCreate) =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
};
